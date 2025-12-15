import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export type ResetPasswordInput = {
  current_password: string;
  new_password: string;
};

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await axiosInstance.post(
        "/user/reset-password",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};
