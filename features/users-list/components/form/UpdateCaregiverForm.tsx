import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "../../api/use-update-user";
import { useGetCurrentUser } from "../../api/use-get-user-by-id";

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

const UpdateCaregiverForm: React.FC<UpdateCaregiverFormProps> = ({ id, onSuccess ,OpenModal}) => {
  const { data: user } = useGetCurrentUser(String(id));
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
          OpenModal(false)
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input {...register("username")} className="border rounded px-2 py-1 w-full" />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password")} className="border rounded px-2 py-1 w-full" />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register("email")} className="border rounded px-2 py-1 w-full" />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input {...register("phone_number")} className="border rounded px-2 py-1 w-full" />
          {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input {...register("first_name")} className="border rounded px-2 py-1 w-full" />
          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input {...register("last_name")} className="border rounded px-2 py-1 w-full" />
          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select {...register("status")} className="border rounded px-2 py-1 w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium">Relationship</label>
          <select {...register("relationship_to_patient")} className="border rounded px-2 py-1 w-full">
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold transition"
      >
        Update Caregiver
      </button>
    </form>
  );
};

export default UpdateCaregiverForm;
