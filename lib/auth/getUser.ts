import { User } from "@/types";
import { TABLES } from "@/utils/constants";
import { pool } from "../db";

const { USERS } = TABLES;

export const getUser = async (
  type: 'email' | 'id',
  ref?: string | number | null,
) => {
  if (!ref) return null;

  const {
    rows: [user],
  } = await pool.query<User>(
    `
      SELECT 
        id,
        name,
        image,
        email,
        role,
        password,
        auth_method,
        created_at
      FROM ${USERS}
      WHERE ${type} = $1;
    `,
    [ref],
  );

  return user;
};