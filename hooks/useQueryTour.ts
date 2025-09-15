import { useQuery } from "@tanstack/react-query";
import { Tour } from "@/types";

const fetchTourById = async (tourId: number): Promise<Tour> => {
  const response = await fetch(`/api/tours/${tourId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch tour");
  }
  
  return response.json();
};

export const useQueryTourById = (tourId: number) => {
  return useQuery({
    queryKey: ["tour", tourId],
    queryFn: () => fetchTourById(tourId),
    enabled: !!tourId,
    // Important: These options ensure data is refetched on navigation
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};