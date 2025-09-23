import { z } from "zod";



export const patientSchema = z.object({
  role: z.literal("patient"),
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  phone_number: z.string().min(10),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  national_code: z.string().length(10),
  dob: z.string().refine(date => !isNaN(Date.parse(date))),
  gender: z.boolean(),
  weight: z.number().min(0),
  height: z.number().min(0),
  caregiver_id: z.number().nullable(),
});

export const caregiverSchema = z.object({
  role: z.literal("caregiver"),
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  phone_number: z.string().min(10),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  relationship_to_user: z.string().min(1),
  assigned_patients: z.array(z.number()).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(4, { message: "Password must be at least 6 characters" }),
});

export const signUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().min(10, { message: "Phone number is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role: z.literal("caregiver"),
  relationship_to_user: z.string().min(1, { message: "Please select a relationship" }),
});



