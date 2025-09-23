import axiosInstance from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchAdminUsers = async (userId: string) => {
  const { data } = await axiosInstance.get(`/admin/users/${userId}`);
  return data;
};

export function useGetCurrentUser(userId: string) {
  return useQuery({
    queryKey: ["admin-users", userId],
    queryFn: () => fetchAdminUsers(userId),
    enabled: !!userId, 
  });
}
