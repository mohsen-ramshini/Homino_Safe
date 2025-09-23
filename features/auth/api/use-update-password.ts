import { toast } from "sonner";
import { useMutation } from "react-query";
// ...other imports

export function useUpdatePassword() {
  const mutation = useMutation(
    async (values: { password: string; confirmPassword: string }) => {
      // ...API call to update password...
      // return await apiCall...
    },
    {
      onSuccess: () => {
        toast.success("Password updated successfully!");
        // ...any other success handling...
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update password");
        // ...any other error handling...
      },
    }
  );
  return mutation;
}