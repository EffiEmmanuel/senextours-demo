import { getUsers } from "@/apis/user";
import { QUERY_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useQueryUsers = (userId: number) => useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: getUsers,
    enabled: !!userId,
})