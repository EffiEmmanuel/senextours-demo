import { User, Tour, Task } from "@/types";
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

// Tour related functions
export const updateTourStatus = async (tourId: number, status: string) => {
  const { data } = await axios.patch(`/api/tours/${tourId}/status`, { status });
  return data;
};

export const deleteTour = async (tourId: number) => {
  const { data } = await axios.delete(`/api/tours/${tourId}`);
  return data;
};

// Task related functions
export const updateTaskStatus = async (taskId: number, status: string) => {
  const { data } = await axios.patch(`/api/tasks/${taskId}/status`, { status });
  return data;
};

export const updateTaskAssignee = async (taskId: number, assigneeId: string) => {
  const { data } = await axios.patch(`/api/tasks/${taskId}/assignee`, { assigneeId });
  return data;
};

export const deleteTask = async (taskId: number) => {
  const { data } = await axios.delete(`/api/tasks/${taskId}`);
  return data;
};
