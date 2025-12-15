"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronRightIcon } from "lucide-react";
import { useSignup } from "../../../api/use-sign-up"; // مسیر هوک خودت را درست وارد کن

export type PatientFormValues = {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: string; // همیشه "patient"
  national_code: string;
  dob: string; // تاریخ تولد به فرمت YYYY-MM-DD
  gender: string;
  weight: number;
  height: number;
  caregiver_id?: number; // اختیاری، رندر نمی‌شود
  doctor_id?: number; // اختیاری، رندر نمی‌شود
};

interface Props {
  onContinue: (data: any) => void;
  onPrevious?: () => void;
}

export const PatientInfoStep = ({onContinue}: Props) => {
  const router = useRouter();
  const signupMutation = useSignup();

  const [formData, setFormData] = useState<PatientFormValues>({
    username: "",
    password: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    role: "patient",
    national_code: "",
    dob: "",
    gender: "Male",
    weight: 1,
    height: 1,
    caregiver_id: undefined,
    doctor_id: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["weight", "height"].includes(name) ? Number(value) : value,
    }));
  };

  const handleContinue = () => {
    signupMutation.mutate(formData);
    onContinue("patient-info")
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#3b3a36]">
      <div className="w-full max-w-5xl dark:bg-zinc-900 rounded-2xl p-8 md:p-10 overflow-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-2">Patient Information</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Please fill out the patient information carefully so the system can create an accurate profile.
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "first_name",
            "last_name",
            "username",
            "email",
            "phone_number",
            "password",
            "national_code",
            "dob",
            "weight",
            "height",
          ].map((field) => {
            let type: string = "text";
            let label = field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());

            if (field === "password") type = "password";
            if (field === "dob") {
              type = "date";
              label = "Date of Birth";
            }
            if (["weight", "height"].includes(field)) type = "number";

            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{label}</label>
                <Input
                  name={field}
                  type={type}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  placeholder={label}
                />
              </div>
            );
          })}

          {/* Gender select */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Gender</label>
            <Select
              value={formData.gender}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 z-50">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/auth/sign-in")}
            className="text-gray-600 dark:text-gray-400 hover:underline"
          >
            Back to Sign In
          </Button>

          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-[#8a7f63] text-white flex items-center gap-2"

          >
                Continue <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
