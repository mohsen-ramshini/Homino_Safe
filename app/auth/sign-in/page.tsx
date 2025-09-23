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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("❌ Error", error);
    },
  });
};


  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-secondary py-8">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-md tracking-wide mb-10">
        HominoSafe
      </h1>
      <div className="w-5/6 lg:w-3/5 flex justify-center items-center">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
};

export default Page;
