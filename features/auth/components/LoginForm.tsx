"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import {BackgroundImage} from "/assets/images/bg-auth"

import { z } from "zod";
import Image from "next/image";

// ======================
// Schema
// ======================
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  className?: string;
};

// ======================
// Component
// ======================
export function LoginForm({ onSubmit, className }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="overflow-hidden rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* فرم */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 md:p-10"
          >
            <FieldGroup className="gap-6">
              {/* Header */}
              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Sign in to your account
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Enter your username and password
                </p>
              </div>

              {/* Username */}
              <Field className="gap-1.5">
                <FieldLabel className="text-sm font-medium">
                  Username
                </FieldLabel>
                <Input
                  className="h-11 px-4 text-sm"
                  placeholder="Enter your username"
                  {...form.register("username")}
                  dir="ltr"
                />
                {form.formState.errors.username && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </Field>

              {/* Password */}
              <Field className="gap-1.5">
                <FieldLabel className="text-sm font-medium">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-11 px-4 pr-10 text-sm"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              {/* Forgot password */}
              <div className="text-right">
                <Link
                  href="/forget-password"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Field>
                <Button className="h-11 w-full text-sm font-medium">
                  Sign In
                </Button>
              </Field>

              {/* Separator */}
              <FieldSeparator className="text-xs text-muted-foreground">
                Or continue with
              </FieldSeparator>

              {/* Social */}
              <Field className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-11 text-sm font-medium"
                  type="button"
                >
                  Apple
                </Button>
                <Button
                  variant="outline"
                  className="h-11 text-sm font-medium"
                  type="button"
                >
                  Google
                </Button>
              </Field>

              {/* Footer */}
              <FieldDescription className="text-center text-sm">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/sign-up")}
                  className="font-medium underline underline-offset-4"
                >
                  Sign up
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/assets/images/bg-auth.jpg"
              alt="Login visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </div>

      {/* Terms */}
      <FieldDescription className="px-6 text-center text-xs leading-relaxed">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>.
      </FieldDescription>
    </div>
  );
}
