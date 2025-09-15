"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUsers } from "@/hooks/useQueryUsers";
import { useSession } from "next-auth/react";
import axios from "axios";

interface CreateTaskFormProps {
  toggleCreateTourModal: () => void;
  updateTaskId?: number | null;
  tourId: number;
}

export const CreateTaskForm = ({
  toggleCreateTourModal,
  updateTaskId,
  tourId,
}: CreateTaskFormProps) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const { data: users } = useQueryUsers(session.data?.user?.id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedTo: "",
    status: "To-Do",
  });

  useEffect(() => {
    if (updateTaskId) {
      // Fetch task data for editing
      fetchTaskData(updateTaskId);
    }
  }, [updateTaskId]);

  const fetchTaskData = async (taskId: number) => {
    try {
      const { data } = await axios.get(`/api/tasks/${taskId}`);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        assignedTo: data.assignedTo?.id?.toString() || "",
        status: data.status || "To-Do",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch task data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tour_id: tourId,
      };

      if (updateTaskId) {
        // Update existing task
        await axios.patch(`/api/tasks/${updateTaskId}`, payload);
        toast.success("Task updated successfully");
      } else {
        // Create new task
        await axios.post("/api/tasks", payload);
        toast.success("Task created successfully");
      }
      
      // Invalidate tasks query to refetch the list
      await queryClient.invalidateQueries({ queryKey: ["tasks", tourId] });
      toggleCreateTourModal();
    } catch (error) {
      console.error(error);
      toast.error(updateTaskId ? "Failed to update task" : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        {updateTaskId ? "Update Task" : "Create New Task"}
      </h2>
      
      <div>
        <Label htmlFor="name">Task Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter task name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Date / Hotel Name</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter date or hotel name"
        />
      </div>

      <div>
        <Label htmlFor="assignedTo">Assign To</Label>
        <Select
          value={formData.assignedTo}
          onValueChange={(value) => handleChange("assignedTo", value)}
        >
          <SelectTrigger id="assignedTo">
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To-Do">To-Do</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={toggleCreateTourModal}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : updateTaskId ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};