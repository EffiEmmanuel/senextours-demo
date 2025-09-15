import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types";

const fetchTasks = async (tourId?: number): Promise<Task[]> => {
  const url = tourId ? `/api/tasks?tourId=${tourId}` : "/api/tasks";
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  return response.json();
};

export const useQueryTasks = (tourId?: number) => {
  return useQuery({
    queryKey: ["tasks", tourId],
    queryFn: () => fetchTasks(tourId),
    // Important: These options ensure data is refetched on navigation
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};