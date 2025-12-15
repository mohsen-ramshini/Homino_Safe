"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit, LoaderIcon, Watch, Clock, X } from "lucide-react";

import { useUserProfile } from "@/features/profile/hook/useGetUser";
import { useDeviceLogin } from "@/features/dashboard/api/patient/useDeviceLogin";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// OTP Toast Component با دکمه بستن
function OtpToast({ code, duration, toastId }: { code: string; duration: number; toastId: string }) {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 p-3 bg-green-50 dark:bg-zinc-700 border border-green-200 dark:border-zinc-600 rounded-xl shadow-md min-w-[220px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">One-Time Password</p>
          <p className="text-2xl font-bold tracking-widest text-green-600">{code}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{seconds}s</span>
          </div>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Close OTP"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileCard() {
  const { data: user } = useUserProfile();
  const { mutate: deviceLogin, isLoading: isDeviceLoading } = useDeviceLogin();
  const [otpActive, setOtpActive] = useState(false);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No user data available.
      </div>
    );
  }

  const handleConnectDevice = () => {
    deviceLogin(undefined, {
      onSuccess: (data) => {
        setOtpActive(true);

        // نمایش OTP در toast با دکمه بستن
        const toastId = toast.custom((t) => (
          <OtpToast code={data.code} duration={data.expires_in_seconds} toastId={(t as any).id} />
        ), {
          duration: Infinity,
          position: "top-right",
        });


        // فعال شدن دوباره دکمه پس از پایان مدت زمان
        setTimeout(() => {
          setOtpActive(false);
        }, data.expires_in_seconds * 1000);
      },
      onError: () => {
        toast.error("Device connection failed");
      },
    });
  };

  return (
    <Card className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
        <div className="relative flex flex-col items-center">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-200 dark:border-zinc-600 shadow-lg">
            <AvatarImage src="/placeholder-user.png" alt={user.first_name} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
            <Link href="/dashboard/profile">
              <Button
                variant="outline"
                size="icon"
                className="p-1 w-8 h-8"
                aria-label="Edit profile"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 w-full text-center sm:text-left">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {user.first_name} {user.last_name}
          </CardTitle>
          <div className="mt-2 flex justify-center sm:justify-start">
            <Button
              onClick={handleConnectDevice}
              disabled={isDeviceLoading || otpActive}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeviceLoading ? (
                <LoaderIcon className="w-4 h-4 animate-spin" />
              ) : (
                <Watch className="w-4 h-4" />
              )}
              <span>{isDeviceLoading ? "Connecting..." : "Connect Device"}</span>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="mt-6 px-0">
        <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
          <Card className="bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-lg font-semibold">{user.age}</p>
          </Card>
          <Card className="bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-lg font-semibold">{user.height}</p>
          </Card>
          <Card className="bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-lg font-semibold">{user.weight}</p>
          </Card>
        </div>

        <div className="grid sm:hidden bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm gap-2">
          <div className="flex justify-between text-center">
            <div className="flex flex-col flex-1">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-lg font-semibold">{user.age}</p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="text-lg font-semibold">{user.weight}</p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="text-lg font-semibold">{user.height}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
