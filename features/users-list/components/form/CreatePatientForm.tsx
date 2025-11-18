import React, { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "../../api/use-create-user";
import { useGetUsersByRole } from "../../api/use-get-users-by-role";
import { Eye, EyeOff } from "lucide-react";

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
    const [showPassword, setShowPassword] = useState(false);

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
<form
  onSubmit={handleSubmit(onSubmit)}
  className="max-w-5xl mx-auto p-6 space-y-6"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {/* Username */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
        {...register("username")}
        placeholder="Enter username"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.username && (
        <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>
      )}
    </div>

    {/* Password */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
      <div className="flex w-full">
        <input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          placeholder="Enter New password"
          className="border rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="relative -left-2 top-5 -ml-5 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.password && (
        <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
      )}
    </div>

    {/* Email */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        {...register("email")}
        placeholder="Enter email"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.email && (
        <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
      )}
    </div>

    {/* Phone Number */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Phone Number</label>
      <input
        {...register("phone_number")}
        placeholder="Enter phone number"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.phone_number && (
        <span className="text-red-500 text-xs mt-1">{errors.phone_number.message}</span>
      )}
    </div>

    {/* First Name */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">First Name</label>
      <input
        {...register("first_name")}
        placeholder="Enter first name"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.first_name && (
        <span className="text-red-500 text-xs mt-1">{errors.first_name.message}</span>
      )}
    </div>

    {/* Last Name */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Last Name</label>
      <input
        {...register("last_name")}
        placeholder="Enter last name"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.last_name && (
        <span className="text-red-500 text-xs mt-1">{errors.last_name.message}</span>
      )}
    </div>

    {/* National Code */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">National Code</label>
      <input
        {...register("national_code")}
        placeholder="Enter national code"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.national_code && (
        <span className="text-red-500 text-xs mt-1">{errors.national_code.message}</span>
      )}
    </div>

    {/* Date of Birth */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
      <input
        type="date"
        {...register("dob")}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      />
      {errors.dob && (
        <span className="text-red-500 text-xs mt-1">{errors.dob.message}</span>
      )}
    </div>

    {/* Gender */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Gender</label>
      <select
        {...register("gender")}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && (
        <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>
      )}
    </div>

{/* Weight */}
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
  <input
    type="text"
    {...register("weight", {
      required: "Weight is required",
      pattern: {
        value: /^[1-9]\d*(\.\d+)?$/, // فقط اعداد مثبت غیر صفر و اعشاری
        message: "Enter a valid weight greater than 0"
      }
    })}
    placeholder="Enter weight"
    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
  />
  {errors.weight && (
    <span className="text-red-500 text-xs mt-1">{errors.weight.message}</span>
  )}
</div>

{/* Height */}
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
  <input
    type="text"
    {...register("height", {
      required: "Height is required",
      pattern: {
        value: /^[1-9]\d*(\.\d+)?$/, // فقط اعداد مثبت غیر صفر و اعشاری
        message: "Enter a valid height greater than 0"
      }
    })}
    placeholder="Enter height"
    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
  />
  {errors.height && (
    <span className="text-red-500 text-xs mt-1">{errors.height.message}</span>
  )}
</div>


    {/* Status */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        {...register("status")}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      >
        <option value="">Select status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {errors.status && (
        <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>
      )}
    </div>

    {/* Caregiver */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Caregiver</label>
      <select
        {...register("caregiver_id")}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
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

    {/* Doctor */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Doctor</label>
      <select
        {...register("doctor_id")}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
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

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all mt-5"
  >
    Create
  </button>
</form>

  );
};

export default CreatePatientForm;
