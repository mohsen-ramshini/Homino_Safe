"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/features/profile/hook/useGetUser";
import { Pencil, Save, Lock, X } from "lucide-react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { LoaderIcon } from "@/components/chat/icons";
import { toast } from 'sonner';

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(10, "Phone number is too short"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  current_password: z.string().min(6, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfileViewPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { data: user, isLoading } = useUserProfile();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone_number: "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user]);

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile form submitted:", data);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const onChangePassword = (data: PasswordForm) => {
    console.log("Password change submitted:", data);
    toast.success("Password changed successfully!");
    setShowPasswordModal(false);
    passwordForm.reset();
  };

  const fields: {
    label: string;
    name: keyof ProfileForm;
    type?: string;
  }[] = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Username", name: "username" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone Number", name: "phone_number" },
  ];

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <span className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
          <LoaderIcon size={40} />
        </span>
        <span className="text-lg text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto mt-16 rounded-2xl shadow-xl border border-gray-200 relative bg-white">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="rounded-full p-1 bg-white shadow-2xl ring-4 ring-white">
            <Avatar className="w-28 h-28 rounded-full overflow-hidden">
              <AvatarImage src="/avatar.jpg" alt="Avatar" />
              <AvatarFallback className="text-xl font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardHeader className="pt-20">
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Account Settings
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {fields.map(({ label, name, type }) => (
                <div key={name} className="space-y-1.5">
                  <Label htmlFor={name} className="text-sm text-gray-700 font-medium mb-1 block">
                    {label}
                  </Label>
                  <Controller
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <Input
                        id={name}
                        type={type || "text"}
                        disabled={!isEditing}
                        placeholder={label}
                        {...field}
                        className={cn(
                          "rounded-lg px-4 py-2 transition w-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                          !isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"
                        )}
                      />
                    )}
                  />
                  {form.formState.errors[name] && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors[name]?.message}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-10 flex-wrap">
              {isEditing ? (
                <>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-2 rounded-xl"
              >
                <Lock className="w-4 h-4 mr-2" /> Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal تغییر رمز */}
      <ChangePasswordDialog
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={(data) => {
          console.log("Password change submitted:", data);
          setShowPasswordModal(false);
        }}
      />
    </>
  );
}
