import { useQuery } from "@tanstack/react-query";
import { Tour } from "@/types";

const fetchTours = async (userId?: number): Promise<Tour[]> => {
  const url = userId ? `/api/tours?userId=${userId}` : "/api/tours";
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch tours");
  }
  
  return response.json();
};

export const useQueryTours = (userId?: number) => {
  return useQuery({
    queryKey: ["tours", userId],
    queryFn: () => fetchTours(userId),
    // Important: These options ensure data is refetched on navigation
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (previously cacheTime)
  });
};