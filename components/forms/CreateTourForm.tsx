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
import axios from "axios";

interface CreateTourFormProps {
  toggleCreateTourModal: () => void;
  updateTourId?: number | null;
}

export const CreateTourForm = ({
  toggleCreateTourModal,
  updateTourId,
}: CreateTourFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    status: "pending",
  });

  useEffect(() => {
    if (updateTourId) {
      // Fetch tour data for editing
      fetchTourData(updateTourId);
    }
  }, [updateTourId]);

  const fetchTourData = async (tourId: number) => {
    try {
      const { data } = await axios.get(`/api/tours/${tourId}`);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        date: data.date || "",
        status: data.status || "pending",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tour data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (updateTourId) {
        // Update existing tour
        await axios.patch(`/api/tours/${updateTourId}`, formData);
        toast.success("Tour updated successfully");
      } else {
        // Create new tour
        await axios.post("/api/tours", formData);
        toast.success("Tour created successfully");
      }
      
      // Invalidate tours query to refetch the list
      await queryClient.invalidateQueries({ queryKey: ["tours"] });
      toggleCreateTourModal();
    } catch (error) {
      console.error(error);
      toast.error(updateTourId ? "Failed to update tour" : "Failed to create tour");
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
        {updateTourId ? "Update Tour" : "Create New Tour"}
      </h2>
      
      <div>
        <Label htmlFor="name">Tour Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter tour name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter tour description"
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
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
          {loading ? "Processing..." : updateTourId ? "Update Tour" : "Create Tour"}
        </Button>
      </div>
    </form>
  );
};