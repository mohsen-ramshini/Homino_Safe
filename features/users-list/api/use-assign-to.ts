import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

export function useAssignUser(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      axiosInstance.post("/admin/assign-patient", data, {
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      toast.success("User Assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      let message = "Error assigning User";
      if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg).join(" | ");
      } else if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    },
  });
}
