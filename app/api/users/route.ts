import { authOptions } from "@/lib/auth/authOptions";
import { pool } from "@/lib/db";
import { User } from "@/types";
import { USER_ROLE } from "@/utils/constants";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session || session.user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { rows: data } = await pool.query<User[]>(
    `SELECT * FROM users WHERE email != '${session.user.email}'`
  );

  return NextResponse.json(data ?? null);
};
