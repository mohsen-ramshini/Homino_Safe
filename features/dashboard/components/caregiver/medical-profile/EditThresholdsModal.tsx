"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { thresholdsSchema , Thresholds , EditThresholdsModalProps} from "../../../types/caregiver/thresholdsSchema ";


export function EditThresholdsModal({
  userId,
  defaultValues,
  onSubmit,
  trigger,
}: EditThresholdsModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Thresholds>({
    resolver: zodResolver(thresholdsSchema),
    defaultValues: {
      user_id: userId,
      hr_min: 0,
      hr_max: 0,
      bp_sys_min: 0,
      bp_sys_max: 0,
      ...defaultValues,
    },
  });

  // وقتی modal باز شد، مقدار فرم را ریست کنیم
  // (optional, در صورت نیاز)
  React.useEffect(() => {
    reset({
      user_id: userId,
      hr_min: 0,
      hr_max: 0,
      bp_sys_min: 0,
      bp_sys_max: 0,
      ...defaultValues,
    });
  }, [userId, defaultValues, reset]);

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Thresholds</DialogTitle>
          <DialogDescription>
            Update your health thresholds values.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
          })}
          className="space-y-4"
        >
          <input
            type="hidden"
            {...register("user_id", { valueAsNumber: true })}
          />

          <div>
            <Label htmlFor="hr_min">HR Min</Label>
            <Input
              id="hr_min"
              type="number"
              {...register("hr_min", { valueAsNumber: true })}
              aria-invalid={errors.hr_min ? "true" : "false"}
            />
            {errors.hr_min && (
              <p className="text-sm text-red-600">{errors.hr_min.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="hr_max">HR Max</Label>
            <Input
              id="hr_max"
              type="number"
              {...register("hr_max", { valueAsNumber: true })}
              aria-invalid={errors.hr_max ? "true" : "false"}
            />
            {errors.hr_max && (
              <p className="text-sm text-red-600">{errors.hr_max.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bp_sys_min">BP Sys Min</Label>
            <Input
              id="bp_sys_min"
              type="number"
              {...register("bp_sys_min", { valueAsNumber: true })}
              aria-invalid={errors.bp_sys_min ? "true" : "false"}
            />
            {errors.bp_sys_min && (
              <p className="text-sm text-red-600">{errors.bp_sys_min.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bp_sys_max">BP Sys Max</Label>
            <Input
              id="bp_sys_max"
              type="number"
              {...register("bp_sys_max", { valueAsNumber: true })}
              aria-invalid={errors.bp_sys_max ? "true" : "false"}
            />
            {errors.bp_sys_max && (
              <p className="text-sm text-red-600">{errors.bp_sys_max.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
