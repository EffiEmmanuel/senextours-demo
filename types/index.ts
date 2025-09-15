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

export interface Tour {
  id: number;
  name: string;
  description?: string;
  date?: string;
  status: string;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  tour_id: number;
  assignedTo?: User;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}
