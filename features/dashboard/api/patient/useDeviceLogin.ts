// hooks/useDeviceLogin.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";


export const useDeviceLogin = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/device/pair",
        {},
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
