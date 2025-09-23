import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { toast } from 'sonner';

interface UpdateUserParams {
  [key: string]: any; // مثلا name, email, password
}

export function useUpdateUser(role: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      axiosInstance.put(
        `/admin/users/${id}`,
        { ...data, role: role },
        { headers: { "Content-Type": "application/json" } }
      ),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      let message = "Error updating User";
      if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg).join(" | ");
      } else if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    },
  });
}
