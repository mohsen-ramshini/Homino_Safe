import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "../../api/use-update-user";
import { useGetCurrentUser } from "../../api/use-get-user-by-id";
import { useGetUsersByRole } from "../../api/use-get-users-by-role";
import { Eye, EyeOff } from "lucide-react";

// 🟢 Schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.literal("patient"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
  national_code: z.string().min(1, "National code is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]),
  weight: z.coerce.number().min(0, "Weight is required"),
  height: z.coerce.number().min(0, "Height is required"),

  caregiver_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  doctor_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
});

type UpdatePatientFormValues = z.infer<typeof schema>;

interface UpdatePatientFormProps {
  id: string | number;
  onSuccess?: () => void;
  OpenModal: (isOpen: boolean) => void;
}

const UpdatePatientForm: React.FC<UpdatePatientFormProps> = ({ id, onSuccess, OpenModal }) => {
  const { data: user } = useGetCurrentUser(String(id));
  const mutation = useUpdateUser("patient");
  const [showPassword, setShowPassword] = useState(false);

  const { data: caregivers = [], isLoading: loadingCaregivers } = useGetUsersByRole("caregiver");
  const { data: doctors = [], isLoading: loadingDoctors } = useGetUsersByRole("doctor");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePatientFormValues>({
    resolver: zodResolver(schema) as Resolver<UpdatePatientFormValues>,
  });

  // 🟢 Autofill data when user is loaded
  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<UpdatePatientFormValues> = (data) => {
    mutation.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          OpenModal(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-2xl mx-auto p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input {...register("username")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register("email")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input {...register("first_name")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input {...register("last_name")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input {...register("phone_number")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="flex w-full">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter New password"
              className="border rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
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
            <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="border rounded-lg px-3 py-2 w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
        </div>

        {/* National Code */}
        <div>
          <label className="block text-sm font-medium mb-1">National Code</label>
          <input {...register("national_code")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.national_code && <span className="text-red-500 text-xs">{errors.national_code.message}</span>}
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" {...register("dob")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.dob && <span className="text-red-500 text-xs">{errors.dob.message}</span>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select {...register("gender")} className="border rounded-lg px-3 py-2 w-full">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <span className="text-red-500 text-xs">{errors.gender.message}</span>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input     type="text"
            {...register("weight", {
              required: "Weight is required",
              pattern: {
                value: /^[1-9]\d*(\.\d+)?$/,
                message: "Enter a valid weight greater than 0"
              }
            })} className="border rounded-lg px-3 py-2 w-full" />
          {errors.weight && <span className="text-red-500 text-xs">{errors.weight.message}</span>}
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <input     type="text"
            {...register("height", {
              required: "Height is required",
              pattern: {
                value: /^[1-9]\d*(\.\d+)?$/, // فقط اعداد مثبت غیر صفر و اعشاری
                message: "Enter a valid height greater than 0"
              }
            })} className="border rounded-lg px-3 py-2 w-full" />
          {errors.height && <span className="text-red-500 text-xs">{errors.height.message}</span>}
        </div>

        {/* Caregiver Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Caregiver</label>
          <select
            {...register("caregiver_id")}
            className="border rounded-lg px-3 py-1 w-full"
            disabled={loadingCaregivers}
          >
            <option value="">Select Caregiver</option>
            {caregivers.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
          {errors.caregiver_id && <span className="text-red-500 text-xs">{errors.caregiver_id.message}</span>}
        </div>

        {/* Doctor Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            {...register("doctor_id")}
            className="border rounded-lg px-3 py-1 w-full"
            disabled={loadingDoctors}
          >
            <option value="">Select Doctor</option>
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.first_name} {d.last_name}
              </option>
            ))}
          </select>
          {errors.doctor_id && <span className="text-red-500 text-xs">{errors.doctor_id.message}</span>}
        </div>
      </div>

      <input type="hidden" value="patient" {...register("role")} />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full font-semibold transition"
      >
        Update Patient
      </button>
    </form>
  );
};

export default UpdatePatientForm;
