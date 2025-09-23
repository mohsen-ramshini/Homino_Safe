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
import { useUpdateEhr } from "@/features/patients-list/api/use-update-ehr";

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
});
const symptomSchema = z.object({
  name: z.string().min(1, "Symptom name is required"),
  severity: z.string().min(1, "Severity is required"),
  onset_date: z.string().min(1, "Onset date is required"),
  notes: z.string().optional(),
});
const ehrSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  notes: z.string().min(1, "Notes are required"),
  timestamp: z.string().min(1, "Timestamp is required"),
  medications: z.array(medicationSchema),
  symptoms: z.array(symptomSchema),
});
type EhrFormValues = z.infer<typeof ehrSchema>;

export function EditThresholdsModal({
  userId,
  defaultValues,
  trigger,
}: {
  userId: number;
  defaultValues?: Partial<EhrFormValues>;
  onSubmit?: (data: EhrFormValues) => void;
  trigger?: React.ReactNode;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = useForm<EhrFormValues>({
    resolver: zodResolver(ehrSchema),
    defaultValues: {
      diagnosis: "",
      notes: "",
      timestamp: new Date().toISOString().slice(0, 16),
      medications: [],
      symptoms: [],
      ...defaultValues,
    },
  });

  const updateEhr = useUpdateEhr();

  React.useEffect(() => {
    reset({
      diagnosis: "",
      notes: "",
      timestamp: new Date().toISOString().slice(0, 16),
      medications: [],
      symptoms: [],
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit EHR</DialogTitle>
          <DialogDescription>
            Update patient EHR information.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            if (!userId || typeof userId !== "number" || isNaN(userId)) {
              alert("User ID is invalid or missing.");
              return;
            }
            updateEhr.mutate({ user_id: userId, ...data, comorbidities: {additionalProp1: {}} });
          })}
          className="space-y-4"
        >
          <div className="flex flex-col">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Input id="diagnosis" {...register("diagnosis")} />
            {errors.diagnosis && (
              <p className="text-sm text-red-600 mt-1">{errors.diagnosis.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register("notes")} />
            {errors.notes && (
              <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="timestamp">Timestamp</Label>
            <Input id="timestamp" type="datetime-local" {...register("timestamp")} />
            {errors.timestamp && (
              <p className="text-sm text-red-600 mt-1">{errors.timestamp.message}</p>
            )}
          </div>
          {/* Medications */}
          <div className="flex flex-col gap-2">
            <Label className="mb-2">Medications</Label>
            {watch("medications").map((med, idx) => (
              <div key={idx} className="border rounded-lg shadow-sm p-4 mb-2 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Name" {...register(`medications.${idx}.name`)} />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input placeholder="Dosage" {...register(`medications.${idx}.dosage`)} />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input placeholder="Frequency" {...register(`medications.${idx}.frequency`)} />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="datetime-local" {...register(`medications.${idx}.start_date`)} />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="datetime-local" {...register(`medications.${idx}.end_date`)} />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input placeholder="Notes" {...register(`medications.${idx}.notes`)} />
                  </div>
                </div>
                <Button type="button" variant="destructive" className="mt-2 w-full" onClick={() => setValue("medications", watch("medications").filter((_, i) => i !== idx))}>Remove</Button>
              </div>
            ))}
            <Button type="button" className="mt-2 w-full bg-green-600 hover:bg-green-700" onClick={() => setValue("medications", [...watch("medications"), { name: "", dosage: "", frequency: "", start_date: "", end_date: "", notes: "" }])}>Add Medication</Button>
            {errors.medications && <p className="text-sm text-red-600 mt-1">Medication error</p>}
          </div>
          {/* Symptoms */}
          <div className="flex flex-col gap-2">
            <Label className="mb-2">Symptoms</Label>
            {watch("symptoms").map((sym, idx) => (
              <div key={idx} className="border rounded-lg shadow-sm p-4 mb-2 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Name" {...register(`symptoms.${idx}.name`)} />
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Input placeholder="Severity" {...register(`symptoms.${idx}.severity`)} />
                  </div>
                  <div>
                    <Label>Onset Date</Label>
                    <Input type="datetime-local" {...register(`symptoms.${idx}.onset_date`)} />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input placeholder="Notes" {...register(`symptoms.${idx}.notes`)} />
                  </div>
                </div>
                <Button type="button" variant="destructive" className="mt-2 w-full" onClick={() => setValue("symptoms", watch("symptoms").filter((_, i) => i !== idx))}>Remove</Button>
              </div>
            ))}
            <Button type="button" className="mt-2 w-full bg-green-600 hover:bg-green-700" onClick={() => setValue("symptoms", [...watch("symptoms"), { name: "", severity: "", onset_date: "", notes: "" }])}>Add Symptom</Button>
            {errors.symptoms && <p className="text-sm text-red-600 mt-1">Symptom error</p>}
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
