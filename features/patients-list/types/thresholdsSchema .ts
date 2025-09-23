import { z } from "zod";

export const thresholdsSchema = z.object({
  user_id: z.number().min(1),
  hr_min: z.number().min(0),
  hr_max: z.number().min(0),
  bp_sys_min: z.number().min(0),
  bp_sys_max: z.number().min(0),
});

export interface EditThresholdsModalProps {
  userId: number;
  defaultValues?: Partial<Thresholds>;
  onSubmit: (data: Thresholds) => void;
  trigger?: React.ReactNode;
}

// types/profileSettings.ts
export interface ProfileSettingsPayload {
  user_id: number;
  hr_min: number;
  hr_max: number;
  bp_sys_min: number;
  bp_sys_max: number;
}


export type Thresholds = z.infer<typeof thresholdsSchema>;
