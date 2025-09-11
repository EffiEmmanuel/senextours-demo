import { authOptions } from "@/lib/auth/authOptions";
import { pool } from "@/lib/db";
import { TABLES, USER_ROLE } from "@/utils/constants";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  if (!params.userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await pool.query<User>(`DELETE FROM ${TABLES.USERS} WHERE id = $1`, [
    params.userId,
  ]);

  return NextResponse.json({ message: "User deleted successfully" });
};

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!params.userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const { role } = await req.json();

  if (!role) {
    return NextResponse.json({ message: "Role is required" }, { status: 400 });
  }

  await pool.query<User>(`UPDATE ${TABLES.USERS} SET role = $1 WHERE id = $2`, [
    role,
    params.userId,
  ]);

  return NextResponse.json({ message: "User role updated successfully" });
};
