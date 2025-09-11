import { User } from "@/types";
import axios from "axios";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get("/api/users");
  return data;
};

export const postInviteUser = async (email: string, role: string) => {
  const { data } = await axios.post(`/api/users/invite`, {
    email,
    role,
  });
  return data;
};

export const deleteUser = async (userId: number) => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

export const updateUserRole = async (userId: number, role: string) => {
  const { data } = await axios.patch(`/api/users/${userId}`, { role });
  return data;
};
