"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

// ✅ اسکیمای ورود و ثبت‌نام با استفاده از username
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(4, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(4, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(4, { message: "Confirm password must be at least 6 characters" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Password and confirm password do not match",
        code: "custom",
      });
    }
  });

// ✅ نوع داده‌ها
type AuthFormValues = {
  username: string;
  password: string;
  confirmPassword?: string;
};

type AuthFormProps = {
  onSubmit: (values: AuthFormValues) => void;
  isLogin: boolean;
};

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLogin }) => {
  const router = useRouter();
  const formSchema = isLogin ? loginSchema : signUpSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-8 mt-12 text-left direction-ltr">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary dark:text-white">
          {isLogin ? "Sign In to Your Account" : "Create an Account"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {`Please enter your username and password to ${isLogin ? "sign in" : "sign up"}.`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* ✅ فیلد username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    className="text-left placeholder:text-left"
                    type="text"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          {/* ✅ فیلد password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      dir="ltr"
                      className="text-left placeholder:text-left"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
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
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          {/* ✅ فیلد تکرار رمز عبور فقط برای ثبت‌نام */}
          {!isLogin && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        dir="ltr"
                        className="text-left placeholder:text-left"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 dark:text-gray-400"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
          )}

          {/* ✅ لینک فراموشی رمز عبور در حالت ورود */}
          {isLogin && (
            <Link
              href="/forget-password"
              className="block text-sm text-blue-600 dark:text-blue-400 text-left hover:underline"
            >
              Forgot your password?
            </Link>
          )}

          {/* ✅ دکمه ارسال */}
          <Button type="submit" className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          {/* ✅ لینک تغییر حالت ورود/ثبت‌نام */}
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline"
            onClick={() => router.push(isLogin ? "/auth/sign-up" : "/auth/sign-in")}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
