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
import { cn } from "@/lib/utils";
import { Pencil, Save, Lock, X } from "lucide-react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { LoaderIcon } from "@/components/chat/icons";
import { toast } from "sonner";

import { useUserProfile } from "../hook/useGetUser";
import { useUpdateProfile, UpdateProfileInput } from "../hook/useUpdateProfile";
import { useUser } from "@/context/UserContext";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(0, "Invalid age"),
  gender: z.string().min(1, "Gender is required"),
  weight: z.number().min(0, "Invalid weight"),
  height: z.number().min(0, "Invalid height"),
  bmi: z.number().optional(),
  bmi_category: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

type FieldItem = {
  label: string;
  name: keyof ProfileForm;
  type?: string;
  readOnly?: boolean;
};

export default function ProfileViewPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { user } = useUser();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      age: 0,
      gender: "",
      weight: 0,
      height: 0,
      bmi: undefined,
      bmi_category: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        age: profile.age ?? 0,
        gender: profile.gender || "",
        weight: profile.weight ?? 0,
        height: profile.height ?? 0,
        bmi: profile.bmi,
        bmi_category: profile.bmi_category,
      });
    }
  }, [profile]);

  const onSubmit = (data: ProfileForm) => {
    const updateData: UpdateProfileInput = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: user?.phone_number || "",
      dob: profile?.dob || new Date().toISOString(),
      gender: data.gender,
      weight: data.weight,
      height: data.height,
    };

    updateProfile(updateData, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Failed to update profile.");
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderIcon />
      </div>
    );
  }

  const fields: FieldItem[] = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Username", name: "username" },
    { label: "Email", name: "email", type: "email" },
    { label: "Age", name: "age", type: "number" },
    { label: "Gender", name: "gender" },
    { label: "Weight (kg)", name: "weight", type: "number" },
    { label: "Height (cm)", name: "height", type: "number" },
  ];

  return (
    <>
      <div className="w-full bg-gradient-to-b from-blue-50 to-white py-12 px-4 min-h-screen">
        <Card className="max-w-3xl mx-auto rounded-2xl shadow-xl border border-blue-100 bg-white/80 backdrop-blur-xl relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="rounded-full p-1 bg-white shadow-xl ring-4 ring-blue-200">
              <Avatar className="w-28 h-28 rounded-full">
                <AvatarImage src="/avatar.jpg" alt="Avatar" />
                <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-800">
                  {profile?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <CardHeader className="pt-20 text-center">
            <CardTitle className="text-3xl font-bold text-blue-800">
              Account Settings
            </CardTitle>
            <p className="text-gray-500">Manage your personal information</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 sm:px-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {fields.map(({ label, name, type, readOnly }) => (
                  <div key={name} className="space-y-1.5">
                    <Label className="text-sm text-blue-800 font-medium">{label}</Label>

                    <Controller
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type={type || "text"}
                          // disabled={!isEditing || readOnly ?? false}
                          className={cn(
                            "rounded-xl px-4 py-2 shadow-sm transition border-blue-200 focus:ring-2 focus:ring-blue-500",
                            (!isEditing || readOnly) && "bg-blue-50 text-gray-500 cursor-not-allowed"
                          )}
                        />
                      )}
                    />

                    {form.formState.errors[name] && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors[name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-10 flex-wrap">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl px-6 py-2 border-blue-500 text-blue-600"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset(profile);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPasswordModal(true)}
                  className="rounded-xl px-6 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <Lock className="w-4 h-4 mr-2" /> Reset Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordDialog
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
