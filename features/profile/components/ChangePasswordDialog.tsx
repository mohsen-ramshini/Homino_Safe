"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderIcon } from "@/components/chat/icons";
import { ResetPasswordInput, useResetPassword } from "../hook/useResetPassword";

const passwordSchema = z.object({
  current_password: z.string().min(6, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordForm = z.infer<typeof passwordSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const { mutate: resetPassword, isLoading } = useResetPassword();

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

const handleSubmit = (data: PasswordForm) => {
  // assert data is ResetPasswordInput
  resetPassword(data as ResetPasswordInput, {
    onSuccess: () => {
      toast.success("Password changed successfully!");
      form.reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to change password.");
    },
  });
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Current password */}
          <div>
            <Label htmlFor="current_password" className="mb-1 block">
              Current Password
            </Label>

            <Controller
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <Input
                  id="current_password"
                  type="password"
                  placeholder="Enter current password"
                  {...field}
                />
              )}
            />

            {form.formState.errors.current_password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.current_password.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div>
            <Label htmlFor="new_password" className="mb-1 block">
              New Password
            </Label>

            <Controller
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              )}
            />

            {form.formState.errors.new_password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.new_password.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              {isLoading && <LoaderIcon />}
              Change Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
