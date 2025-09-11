export type UserRole = "admin" | "staff" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  password: string;
  auth_method: string;
  created_at: Date;
  updated_at: Date;
}
