import { deleteUser } from "@/apis/user";
import { QUERY_KEYS } from "@/utils/constants";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface DeleteUserButtonProps {
  userId: number;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate: deleteUserMutation, isPending } = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
      });
      setTimeout(() => {
        setOpen(false);
      }, 1000);
      toast.success("User has been deleted.");
    },
    onError: () => {
      toast.error("Failed to delete user. Please, try again.");
    },
  });

  const handleDeleteUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteUserMutation();
  };

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconTrash
          size={16}
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer text-red-500"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this user. This action cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onCancel}
            className="border-custom-black hover:text-white text-custom-black border bg-transparent shadow-none cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            className="shadow-none bg-red-500 cursor-pointer"
          >
            {isPending ? <Loader className="animate-spin" /> : "Yes, proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
