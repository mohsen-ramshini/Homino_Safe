import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "../../api/use-update-user";
import { useGetCurrentUser } from "../../api/use-get-user-by-id";
import { Eye, EyeOff } from "lucide-react";


const relationships = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Spouse",
  "Child",
  "Relative",
  "Friend",
  "Other",
];


const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.literal("doctor"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
  specialization: z.string().optional(),
});

type UpdatePatientFormValues = z.infer<typeof schema>;

interface UpdatePatientFormProps {
  id: string | number;
  onSuccess?: () => void;
  OpenModal: (isOpen: boolean) => void;
}

const UpdatePatientForm: React.FC<UpdatePatientFormProps> = ({ id, onSuccess , OpenModal }) => {
  const { data: user } = useGetCurrentUser(String(id));
    const [showPassword, setShowPassword] = useState(false);
  const mutation = useUpdateUser("doctor");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePatientFormValues>({
    resolver: zodResolver(schema),
  });

  // 🟢 Autofill data when user is loaded
  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = (data: UpdatePatientFormValues) => {
    mutation.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          OpenModal(false)
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input {...register("username")} className="border rounded-lg px-3 py-2 w-full" />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register("email")} className="border rounded-lg px-2 py-2 w-full" />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input {...register("phone_number")} className="border rounded-lg px-2 py-2 w-full" />
          {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input {...register("first_name")} className="border rounded-lg px-2 py-2 w-full" />
          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input {...register("last_name")} className="border rounded-lg px-2 py-2 w-full" />
          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="border rounded-lg px-2 py-2 w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium mb-1">Specialization</label>
          <input {...register("specialization")} className="border rounded-lg px-2 py-2 w-full" />
          {errors.specialization && <span className="text-red-500 text-xs">{errors.specialization.message}</span>}
        </div>
      </div>

      <input type="hidden" value="patient" {...register("role")} />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full font-semibold transition"
      >
        Update Doctor
      </button>
    </form>
  );
};

export default UpdatePatientForm;
