"use client";

import { useUser } from "@/context/UserContext";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id || user === null) {
      router.replace("/auth/sign-in");
    } else {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <>
      <Toaster richColors position="top-center" />
    </>
  );
}
