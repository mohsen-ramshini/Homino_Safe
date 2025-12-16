"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";
import { useSignup } from "../../../api/use-sign-up";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


/* =========================
   ZOD SCHEMA
========================= */
export const patientSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^09\d{9}$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  national_code: z
    .string()
    .length(10, "National code must be exactly 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]),
  weight: z.number().min(1, "Weight must be greater than 0"),
  height: z.number().min(1, "Height must be greater than 0"),

  role: z.literal("patient"),
  caregiver_id: z.number().optional(),
  doctor_id: z.number().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface Props {
  onContinue: (step: string) => void;
  setUserInfo: (data: object)=> void;
}

/* =========================
   COMPONENT
========================= */
export const PatientInfoStep = ({ onContinue, setUserInfo }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
     mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone_number: "",
      password: "",
      national_code: "",
      dob: "",
      gender: "Male",
      weight: null,
      height: null,
      role: "patient",
    },
  });

const onSubmit = (data: PatientFormValues) => {
  signupMutation.mutate(data, {
    onSuccess: (response) => {

      console.log("response",response);
      

      setUserInfo(response);
      onContinue("patient-info");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail?.[0]?.msg ?? "Signup failed"
      );
    },
  });
};


  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-5xl rounded-2xl p-8 md:p-10 dark:bg-zinc-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-2">Patient Information</h1>
          <p className="text-gray-500">
            Please fill in the patient information carefully
          </p>
        </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Field label="First Name" error={errors.first_name?.message}>
          <Input
            {...register("first_name")}
            placeholder="Enter your first name"
            className="w-full px-4 py-2"
          />
        </Field>

        <Field label="Last Name" error={errors.last_name?.message}>
          <Input
            {...register("last_name")}
            placeholder="Enter your last name"
            className="w-full px-4 py-2"
          />
        </Field>

        <Field label="Username" error={errors.username?.message}>
          <Input
            {...register("username")}
            placeholder="Choose a username"
            className="w-full px-4 py-2"
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full px-4 py-2"
          />
        </Field>

        <Field label="Phone Number" error={errors.phone_number?.message}>
          <Input
            {...register("phone_number")}
            placeholder="09xxxxxxxxx"
            className="w-full px-4 py-2"
          />
        </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter a secure password"
            className="w-full px-4 py-2 pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </Field>


          <Field label="National Code" error={errors.national_code?.message}>
            <Input
              type="text"
              {...register("national_code", {
                validate: (val) =>
                  /^\d+$/.test(val) || "National code must be a number",
                maxLength: 10,
                minLength: 10,
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              placeholder="Enter your national code"
              className="w-full px-4 py-2"
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Field>

<Field label="Date of Birth" error={errors.dob?.message}>
  <Input
    type="date"
    {...register("dob")}
    placeholder="Select your birth date"
    className="w-full block px-4 py-2"
    style={{ width: "100%", boxSizing: "border-box" }}
  />
</Field>


<Field label="Weight (kg)" error={errors.weight?.message}>
  <Input
    type="number"
    {...register("weight", {
      valueAsNumber: true,
      validate: (val) =>
        typeof val === "number" && val > 0 || "Weight must be a positive number",
    })}
    placeholder="Enter your weight"
    className="w-full px-4 py-2"
  />
</Field>

<Field label="Height (cm)" error={errors.height?.message}>
  <Input
    type="number"
    {...register("height", {
      valueAsNumber: true,
      validate: (val) =>
        typeof val === "number" && val > 0 || "Height must be a positive number",
    })}
    placeholder="Enter your height"
    className="w-full px-4 py-2"
  />
</Field>

          <Field label="Gender" error={errors.gender?.message}>
            <Select
              defaultValue=""
              onValueChange={(val) => setValue("gender", val as "Male" | "Female")}
            >
              <SelectTrigger className="w-full px-4 py-2">
                <SelectValue placeholder="Select Your Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        <div className="md:col-span-3 flex justify-between mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/auth/sign-in")}
          >
            Back to Sign In
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="flex items-center gap-2"
          >
            Continue <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </form>

      </div>
    </div>
  );
};

/* =========================
   FIELD WRAPPER
========================= */
const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col w-full">
    <label className="text-sm font-medium mb-1">{label}</label>
    <div>{children}</div>
    <div className="text-xs text-red-500 mt-1 min-h-[24px] break-words">
      {error ?? "\u00A0"}
    </div>
  </div>
);
