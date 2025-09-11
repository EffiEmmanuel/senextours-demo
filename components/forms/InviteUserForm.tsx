import { postInviteUser } from "@/apis/user";
import { InviteUserSchema } from "@/schemas";
import { QUERY_KEYS, USER_ROLE } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";
import { PageAppLoader } from "../PageAppLoader";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type Option = {
  label: string;
  value: string;
};

type InviteUserFormData = z.infer<typeof InviteUserSchema>;

const roles = [
  {
    value: USER_ROLE.ADMIN,
    label: "Admin",
  },
  {
    value: USER_ROLE.STAFF,
    label: "Staff",
  },
  {
    value: USER_ROLE.USER,
    label: "User",
  },
];

export const InviteUserForm = ({
  toggleInviteUserModal,
}: {
  toggleInviteUserModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const handleInviteUser = async (values: InviteUserFormData) => {
    if (!values.email || !values.role) return;
    setIsLoading(true);
    try {
      await postInviteUser(values.email, values.role);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });
      setIsLoading(false);
      toggleInviteUserModal();
      toast.success("User has been invited.");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Failed to invite user. Please, try again.");
    }
  };

  if (isLoading) {
    return <PageAppLoader className="h-fit" />;
  }

  return (
    <div className="h-auto">
      <h1 className="text-xl font-semibold">Add Subscriber</h1>
      <small className="text-custom-gray-400 text-sm">
        Add a new subscriber to your workspace.
      </small>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleInviteUser)}
          className="mt-4 flex flex-col gap-y-3"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-foreground cursor-pointer w-full rounded-lg px-4 py-2 text-sm font-semibold text-white"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Add Subscriber"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
