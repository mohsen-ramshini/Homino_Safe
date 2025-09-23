import axiosInstance from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface Props {
  role: "caregiver" | "doctor";
}

const fetchAdminUsers = async (role: Props["role"]) => {
  const { data } = await axiosInstance.get(`/admin/users/role/${role}`);
  return data;
};

export function useGetUsersByRole(role: Props["role"]) {
  return useQuery({
    queryKey: ["admin-users",role], 
    queryFn: () => fetchAdminUsers(role), 
  });
}
