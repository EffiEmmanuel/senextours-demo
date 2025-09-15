"use client";

import { useState } from "react";
import { deleteTask } from "@/apis/user";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteTaskButtonProps {
  taskId: number;
}

export const DeleteTaskButton = ({ taskId }: DeleteTaskButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      // Invalidate tasks query to refetch the list
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="ghost"
      className="text-red-500 hover:text-red-700 cursor-pointer"
      disabled={isDeleting}
      title="Delete Task"
    >
      {isDeleting ? (
        <Loader className="animate-spin" size={16} />
      ) : (
        <IconTrash size={16} />
      )}
    </Button>
  );
};