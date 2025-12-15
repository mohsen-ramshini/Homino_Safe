"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// ======================
// Zod Schema
// ======================
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  className?: string;
};

// ======================
// LoginForm Component
// ======================
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, className }) => {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-zinc-700">
                <GalleryVerticalEnd className="h-6 w-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold text-primary dark:text-white">
              Sign In to Your Account
            </h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/auth/sign-up");
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign up
              </a>
            </FieldDescription>
          </div>

          {/* Username Field */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...form.register("username")}
              dir="ltr"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </Field>

          {/* Password Field */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...form.register("password")}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 dark:text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </Field>

          {/* Forgot Password */}
          <Link
            href="/forget-password"
            className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot your password?
          </Link>

          {/* Submit Button */}
          <Field>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </Field>

          {/* Separator */}
          <FieldSeparator>Or continue with</FieldSeparator>

          {/* Social Buttons */}
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">
              Continue with Apple
            </Button>
            <Button variant="outline" type="button">
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Footer */}
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
};
