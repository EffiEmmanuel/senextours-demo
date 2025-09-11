"use client";

import { updateUserRole } from "@/apis/user";
import { CustomModal } from "@/components/CustomModal";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { InviteUserForm } from "@/components/forms/InviteUserForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToggle } from "@/hooks/useHook";
import { useQueryUsers } from "@/hooks/useQueryUsers";
import { QUERY_KEYS, USER_ROLE } from "@/utils/constants";
import { formatDate } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const session = useSession();
  const { data: users } = useQueryUsers(session.data?.user.id ?? 0);
  const queryClient = useQueryClient();
  const [isInviteUserModalOpen, toggleInviteUserModal] = useToggle(false);

  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

  const handleUpdateUserRole = async (userId: number, role: string) => {
    setLoadingUserId(userId);
    try {
      await updateUserRole(userId, role);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role. Please, try again.");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div>
      <CustomModal
        open={isInviteUserModalOpen}
        closeModal={toggleInviteUserModal}
      >
        <InviteUserForm toggleInviteUserModal={toggleInviteUserModal} />
      </CustomModal>
      <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-sm text-gray-500">Manage users and their roles.</p>
        </div>
        <Button onClick={toggleInviteUserModal} className="cursor-pointer">
          Invite User
        </Button>
      </div>
      <div className="mt-6 w-full justify-between gap-x-4 gap-y-4 lg:gap-y-0">
        <div className="border-none shadow-none lg:col-span-3">
          <div className="!p-0">
            <div className="mt-4 overflow-x-auto">
              <div className="bg-custom-gray grid h-14 w-full min-w-[600px] grid-cols-5 items-center rounded-2xl p-2 px-5">
                <small className="text-left">Name</small>
                <small className="text-right">Email Address</small>
                <small className="text-right">Role</small>
                <small className="text-right">Date Added</small>
                <small className="text-right">Actions</small>
              </div>
              {users && users.length ? (
                <div className="w-full min-w-[600px] p-5">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 border-b py-4 last:border-b-0"
                    >
                      <div className="flex flex-col items-start justify-center">
                        <small className="font-semibold sm:hidden">
                          Full Name:
                        </small>
                        <small className="text-left">
                          {user.name ?? "Not set"}
                        </small>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <small className="text-right">{user.email}</small>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        {loadingUserId === user.id ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Select
                            value={user.role}
                            onValueChange={(value) =>
                              handleUpdateUserRole(user.id, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Select role"
                                defaultValue={user.role}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <small className="text-right">
                          {formatDate(user.created_at)}
                        </small>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        {session.data?.user.role === USER_ROLE.ADMIN && (
                          <small className="text-right">
                            <DeleteUserButton userId={user.id} />
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <small className="mt-7 inline-block w-full text-center text-sm">
                  You have no users for now
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
