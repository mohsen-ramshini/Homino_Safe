"use client";

import { useLogin } from "@/features/auth/api/use-sign-in";
import { LoginForm } from "@/features/auth/components/LoginForm";

const Page = () => {
  const loginMutation = useLogin();

const handleSubmit = (values: { username: string; password: string }) => {

  loginMutation.mutate(values, {
    onSuccess: (data) => {
      console.log("✅ Success", data);
    },
    onError: (error: any) => {
      console.error("❌ Error", error);
    },
  });
};


  return (
     <LoginForm onSubmit={handleSubmit} />
  );
};

export default Page;
