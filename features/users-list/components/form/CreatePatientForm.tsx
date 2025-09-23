import React from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "../../api/use-create-user";
import { useGetUsersByRole } from "../../api/use-get-users-by-role";

// 🟢 Schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.literal("patient"),
  national_code: z.string().min(1, "National code is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]),
  weight: z.coerce.number().min(0, "Weight is required"),
  height: z.coerce.number().min(0, "Height is required"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),

  caregiver_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      return Number(val);
    },
    z.number().nullable().optional()
  ),

  doctor_id: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      return Number(val);
    },
    z.number().nullable().optional()
  ),
});

type PatientFormValues = z.infer<typeof schema>;

interface Props {
  setOpen: (open: boolean) => void;
}

// 🟢 Default values
const defaultValues: PatientFormValues = {
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
  weight: 0,
  height: 0,
  status: "active",
  caregiver_id: null,
  doctor_id: null,
};

const CreatePatientForm = ({ setOpen }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormValues>({
    resolver: zodResolver(schema) as Resolver<PatientFormValues>,
    defaultValues,
  });

  const { data: caregivers = [], isLoading: loadingCaregivers } =
    useGetUsersByRole("caregiver");
  const { data: doctors = [], isLoading: loadingDoctors } =
    useGetUsersByRole("doctor");

  const mutation = useCreateUser("patient");

  const onSubmit: SubmitHandler<PatientFormValues> = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Username */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            {...register("username")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>
          )}
        </div>
        {/* Password */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
          )}
        </div>
        {/* Email */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
          )}
        </div>
        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register("phone_number")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.phone_number && (
            <span className="text-red-500 text-xs mt-1">{errors.phone_number.message}</span>
          )}
        </div>
        {/* First Name */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register("first_name")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.first_name && (
            <span className="text-red-500 text-xs mt-1">{errors.first_name.message}</span>
          )}
        </div>
        {/* Last Name */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register("last_name")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.last_name && (
            <span className="text-red-500 text-xs mt-1">{errors.last_name.message}</span>
          )}
        </div>
        {/* National Code */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">National Code</label>
          <input
            {...register("national_code")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.national_code && (
            <span className="text-red-500 text-xs mt-1">{errors.national_code.message}</span>
          )}
        </div>
        {/* Date of Birth */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            {...register("dob")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.dob && (
            <span className="text-red-500 text-xs mt-1">{errors.dob.message}</span>
          )}
        </div>
        {/* Gender */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            {...register("gender")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>
          )}
        </div>
        {/* Weight */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            {...register("weight")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.weight && (
            <span className="text-red-500 text-xs mt-1">{errors.weight.message}</span>
          )}
        </div>
        {/* Height */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            {...register("height")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.height && (
            <span className="text-red-500 text-xs mt-1">{errors.height.message}</span>
          )}
        </div>
        {/* Status */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            {...register("status")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>
          )}
        </div>
        {/* Caregiver Select */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Caregiver</label>
          <select
            {...register("caregiver_id")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loadingCaregivers}
          >
            <option value="">Select Caregiver</option>
            {caregivers.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
          {errors.caregiver_id && (
            <span className="text-red-500 text-xs mt-1">{errors.caregiver_id.message}</span>
          )}
        </div>
        {/* Doctor Select */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            {...register("doctor_id")}
            className="border rounded px-2 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loadingDoctors}
          >
            <option value="">Select Doctor</option>
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.first_name} {d.last_name}
              </option>
            ))}
          </select>
          {errors.doctor_id && (
            <span className="text-red-500 text-xs mt-1">{errors.doctor_id.message}</span>
          )}
        </div>
      </div>
      <input type="hidden" value="patient" {...register("role")} />
      {/* Submit */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow w-full font-semibold transition"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreatePatientForm;
