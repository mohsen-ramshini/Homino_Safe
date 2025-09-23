import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "../../api/use-create-user";
import { relationships } from "../../../auth/types/auth";

// 🟢 Schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.literal("caregiver"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
  relationship_to_patient: z.string().optional(),
});

interface Props {
  setOpen: (open: boolean) => void;
}

type CaregiverFormValues = z.infer<typeof schema>;

// 🟢 Default values
const defaultValues: CaregiverFormValues = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "caregiver",
  password: "",
  status: "active",
  relationship_to_patient: "",
};

const CreatePatientForm = ({ setOpen }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaregiverFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const mutation = useCreateUser("caregiver");

  const onSubmit: SubmitHandler<CaregiverFormValues> = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {reset()
        setOpen(false)
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Username */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input {...register("username")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register("email")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        {/* First Name */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input {...register("first_name")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.first_name && <span className="text-red-500 text-xs mt-1">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input {...register("last_name")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.last_name && <span className="text-red-500 text-xs mt-1">{errors.last_name.message}</span>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input {...register("phone_number")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.phone_number && <span className="text-red-500 text-xs mt-1">{errors.phone_number.message}</span>}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" {...register("password")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>}
        </div>

        {/* Relationship to Patient */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Relationship to Patient</label>
          <select {...register("relationship_to_patient")} className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">Select relationship</option>
            {relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
          {errors.relationship_to_patient && (
            <span className="text-red-500 text-xs mt-1">{errors.relationship_to_patient.message}</span>
          )}
        </div>
      </div>
      <input type="hidden" value="caregiver" {...register("role")} />
      {/* Submit */}
      <div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow w-full font-semibold transition">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreatePatientForm;
