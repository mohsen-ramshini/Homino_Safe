import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { toast } from 'sonner';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      let message = "Error deleting User";
      if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg).join(" | ");
      } else if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    },
  });
}
