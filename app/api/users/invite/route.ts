import { InvitationEmailTemplate } from "@/components/EmailTemplates/invitation";
import { authOptions } from "@/lib/auth/authOptions";
import { getUser } from "@/lib/auth/getUser";
import { pool } from "@/lib/db";
import { USER_ROLE } from "@/utils/constants";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email, role } = await req.json();
  if (!email || !role) {
    return NextResponse.json(
      { message: "Email and role are required" },
      { status: 400 }
    );
  }
  const dbUser = await getUser("email", email);
  if (dbUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const {
    rows: [user],
  } = await pool.query<User>(
    `INSERT INTO users (email, role) VALUES ($1, $2) RETURNING *`,
    [email, role]
  );

  const { data, error } = await resend.emails.send({
    from: "Senex Tours <onboarding@resend.dev>",
    to: ["effi@pubgenius.io"],
    subject: "Welcome to Senex Tours",
    react: InvitationEmailTemplate(),
  });

  if (error)
    return NextResponse.json(
      { message: "Failed to send invitation email" },
      { status: 400 }
    );

  if (data) {
    return NextResponse.json(user ?? null);
  }

  return NextResponse.json(
    { message: "Failed to send invitation email" },
    { status: 400 }
  );
};
