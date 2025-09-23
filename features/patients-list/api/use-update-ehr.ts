import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { toast } from 'sonner';


export function useUpdateEhr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.put(
        `/medical/logs`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users","user-profiles"] });
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
