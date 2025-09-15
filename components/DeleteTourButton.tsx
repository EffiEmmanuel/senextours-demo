"use client";

import { useState } from "react";
import { deleteTour } from "@/apis/user";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteTourButtonProps {
  tourId: number;
}

export const DeleteTourButton = ({ tourId }: DeleteTourButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this tour?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTour(tourId);
      // Invalidate tours query to refetch the list
      await queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success("Tour deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete tour. Please try again.");
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
      title="Delete Tour"
    >
      {isDeleting ? (
        <Loader className="animate-spin" size={16} />
      ) : (
        <IconTrash size={16} />
      )}
    </Button>
  );
};