import { pool } from "@/lib/db";
import { ROUTES } from "@/utils/constants";
import PostgresAdapter from "@auth/pg-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUser } from "./getUser";

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    error: ROUTES.SIGNIN,
    signIn: ROUTES.SIGNIN,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && user.email) {
        // Get the existing user from database to ensure we have the correct ID
        const existingUser = await getUser("email", user.email.toLowerCase());
        if (existingUser) {
          token.id = existingUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userId = token.id as unknown as number;
        session.user.id = userId;
        const email = session.user.email!;
        const dbUser = await getUser("email", email);

        if (!dbUser) {
          throw new Error("User not found.");
        }

        session.user.role = dbUser.role;
      }

      return session;
    },
    async signIn({ user, account }) {
      const existingUser = await getUser("email", user.email?.toLowerCase());

      if (!existingUser) {
        throw new Error(
          "Unauthorized: Your email address is not registered. Please contact an administrator to be added to the system."
        );
      }

      if (account && existingUser) {
        try {
          const { rows: existingAccount } = await pool.query(
            `SELECT id FROM accounts WHERE "userId" = $1 AND provider = $2`,
            [existingUser.id, account.provider]
          );

          console.log("Existing account found:", existingAccount.length > 0);

          if (existingAccount.length === 0) {
            console.log("Creating account record for user:", existingUser.id);
            await pool.query(
              `INSERT INTO accounts ("userId", type, provider, "providerAccountId", access_token, refresh_token, expires_at, id_token, scope, session_state, token_type)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
              [
                existingUser.id,
                account.type,
                account.provider,
                account.providerAccountId,
                account.access_token,
                account.refresh_token,
                account.expires_at,
                account.id_token,
                account.scope,
                account.session_state,
                account.token_type,
              ]
            );
            console.log("Account record created successfully");
          }
        } catch (error) {
          console.error("Error creating account record:", error);
        }
      }

      return true;
    },
  },
};
