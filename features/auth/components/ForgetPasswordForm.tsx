"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/components/chat/icons";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

interface Props {
  onSubmit?: (values: { email: string }) => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Uncomment and adapt this function if you integrate actual email sending logic
  // const sendRecoveryEmail = async (email: string) => {
  //   setLoading(true);
  //   setMessage("");
  //   const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  //     redirectTo: `${window.location.origin}/update-password`,
  //   });
  //
  //   if (error) {
  //     toast.error("Error sending recovery link");
  //   } else {
  //     toast.success("Password recovery link sent to your email. Please check your inbox.");
  //     setCodeSent(true);
  //   }
  //   setLoading(false);
  // };

  const onSubmitHandler = async (values: { email: string }) => {
    try {
      // await sendRecoveryEmail(values.email);
      // onSubmit && onSubmit(values);
      toast.success("Password recovery link sent to your email. Please check your inbox.");
      setCodeSent(true);
    } catch (err) {
      toast.error("Error sending recovery link");
    }
    console.log(values);
  };

  return (
    <div
      className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-6"
    >
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[#172b79]">Password Recovery</h1>
        <Lock size={32} className="mx-auto text-[#172b79]" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-5 text-left"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Email <Mail size={18} />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@example.com"
                    {...field}
                    className="text-left"
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#172b79] text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 flex items-center justify-center">
                  <LoaderIcon size={16} />
                </span>
                Sending...
              </span>
            ) : codeSent ? "Resend Link" : "Send Recovery Link"}
          </Button>

          {message && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {message}
            </p>
          )}

          <Button
            type="button"
            variant="ghost"
            className="w-full text-[#172b79] hover:underline"
            onClick={() => router.push("/sign-in")}
          >
            Back to Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};
