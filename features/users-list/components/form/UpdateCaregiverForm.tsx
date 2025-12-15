import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "../../api/use-update-user";
import { useGetCurrentUser } from "../../api/use-get-user-by-id";
import { Eye, EyeOff } from "lucide-react";

// 🟢 لیست روابط
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

// 🟢 Schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.literal("caregiver"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
  relationship_to_patient: z.string().optional(),
});

type CaregiverFormValues = z.infer<typeof schema>;

interface UpdateCaregiverFormProps {
  id: string | number;
  onSuccess?: () => void;
  OpenModal: (isOpen: boolean) => void;
}

const UpdateCaregiverForm: React.FC<UpdateCaregiverFormProps> = ({ id, onSuccess, OpenModal }) => {
  const { data: user } = useGetCurrentUser(String(id));
  const [showPassword, setShowPassword] = useState(false);
  const mutation = useUpdateUser("caregiver");
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaregiverFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      role: "caregiver",
      password: "",
      status: "active",
      relationship_to_patient: "",
    },
  });

  // 🟢 Autofill
  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = (data: CaregiverFormValues) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            {...register("username")}
            placeholder="Enter username"
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
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
          <input
            type="email"
            {...register("email")}
            placeholder="Enter email"
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register("phone_number")}
            placeholder="Enter phone number"
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register("first_name")}
            placeholder="Enter first name"
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register("last_name")}
            placeholder="Enter last name"
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            {...register("status")}
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium mb-1">Relationship to Patient</label>
          <select
            {...register("relationship_to_patient")}
            className="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          >
            <option value="">Select relationship</option>
            {relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
          {errors.relationship_to_patient && (
            <span className="text-red-500 text-xs">{errors.relationship_to_patient.message}</span>
          )}
        </div>
      </div>

      {/* Hidden Role */}
      <input type="hidden" value="caregiver" {...register("role")} />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full font-semibold transition"
      >
        Update Caregiver
      </button>
    </form>
  );
};

export default UpdateCaregiverForm;
