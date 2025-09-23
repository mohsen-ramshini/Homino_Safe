import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

interface CreateUserParams {
  [key: string]: any; // مثلا name, email, password
}

export function useCreateUser(
  role: string, 
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserParams) =>
      axiosInstance.post(
        `/admin/users`,
        { ...data, role },
        { headers: { "Content-Type": "application/json" } }
      ),
    onSuccess: () => {
      toast.success(`${role} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      const detail = error?.response?.data?.detail;
      let message = `Error creating ${role}`;
      if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg).join(" | ");
      } else if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    },
  });
}
