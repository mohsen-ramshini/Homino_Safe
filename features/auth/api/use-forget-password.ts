import { toast } from "sonner";
import { useMutation } from "react-query";
// ...other imports

export function useForgetPassword() {
  const mutation = useMutation(
    async (values: { email: string }) => {
      // ...existing code...
      // return await apiCall...
    },
    {
      onSuccess: () => {
        toast.success("Password recovery link sent to your email.");
        // ...existing code...
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to send recovery link");
        // ...existing code...
      },
    }
  );
  return mutation;
}