import { toast } from "sonner";

export function useUpdatePassword() {
  const updatePassword = async (values: { password: string; confirmPassword: string }) => {
    // اینجا می‌توانید فراخوانی API اضافه کنید
    // مثال: await apiCall(values.password, values.confirmPassword);

    // نمونه Toast ساده (دلخواه)
    toast.success("Password updated successfully!");
  };

  return updatePassword;
}
