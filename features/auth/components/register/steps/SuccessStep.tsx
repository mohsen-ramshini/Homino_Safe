"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  status: "success" | "failed";
}

export const SuccessStep = ({ status }: Props) => {
  const router = useRouter();

  const title = status === "success" ? "Registration Completed" : "Registration Failed";
  const message =
    status === "success"
      ? "Patient information has been successfully saved!"
      : "There was an error saving the patient information. Please try again.";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-4xl font-semibold mb-4">{title}</h1>
      <p className="text-lg text-[#6b6555] mb-8">{message}</p>

      <Button
        onClick={() => router.push("/auth/sign-in")}
        size="lg"
        className="bg-[#8a7f63] text-white hover:bg-[#7b7158]"
      >
        Back to Sign In
      </Button>
    </div>
  );
};
