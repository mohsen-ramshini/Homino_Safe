// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff } from "lucide-react";

// import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// import { signUpSchema, relationships } from "../types/schema";
// import { SignUpFormProps, SignUpFormValues } from "../types/auth";

// export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
//   const router = useRouter();

//   const form = useForm<SignUpFormValues>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//       confirmPassword: "",
//       email: "",
//       phone_number: "",
//       first_name: "",
//       last_name: "",
//       role: "caregiver",
//       relationship_to_user: "",
//     },
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-10 mt-12 text-left">
//       <div className="mb-6 text-center">
//         <h1 className="text-2xl font-bold text-primary dark:text-white">Create a New Account</h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//           Please fill in the information below to register.
//         </p>
//       </div>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {["first_name", "last_name", "username", "email", "phone_number"].map((fieldName) => (
//             <FormField
//               key={fieldName}
//               control={form.control}
//               name={fieldName as keyof SignUpFormValues}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{fieldName.replace("_", " ").toUpperCase()}</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder={fieldName} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}

//           {/* Password */}
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter password" />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 dark:text-gray-400"
//                       tabIndex={-1}
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Confirm Password */}
//           <FormField
//             control={form.control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Confirm Password</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Input {...field} type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 dark:text-gray-400"
//                       tabIndex={-1}
//                     >
//                       {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Relationship */}
//           <FormField
//             control={form.control}
//             name="relationship_to_user"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Relationship to User</FormLabel>
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select relationship" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white dark:bg-zinc-900 z-50">
//                     {relationships.map((rel) => (
//                       <SelectItem key={rel} value={rel}>
//                         {rel}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <input type="hidden" {...form.register("role")} value="caregiver" />

//         <Button type="submit" className="w-full mt-4">
//           Sign Up
//         </Button>

//         <Button
//           type="button"
//           variant="ghost"
//           className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline"
//           onClick={() => router.push("/auth/sign-in")}
//         >
//           Already have an account? Sign In
//         </Button>
//       </form>
//     </div>
//   );
// };
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const relationships = ["Parent", "Sibling", "Spouse", "Friend", "Other"];

export type SignUpFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: string;
  relationship_to_user: string;
};

interface SignUpFormProps {
  onSubmit: (values: SignUpFormValues) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormValues>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    role: "caregiver",
    relationship_to_user: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ساده‌ترین اعتبارسنجی
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      alert("Username and passwords are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-10 mt-12 text-left">
      <h1 className="text-2xl font-bold mb-4 text-center">Create a New Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["first_name", "last_name", "username", "email", "phone_number"].map((field) => (
            <div key={field}>
              <label className="block capitalize">{field.replace("_", " ")}</label>
              <Input
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                placeholder={field}
              />
            </div>
          ))}

          {/* Password */}
          <div>
            <label>Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 px-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 px-2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label>Relationship to User</label>
            <Select
              value={formData.relationship_to_user}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, relationship_to_user: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 z-50">
                {relationships.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <input type="hidden" name="role" value="caregiver" />

        <Button type="submit" className="w-full mt-4">
          Sign Up
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline"
          onClick={() => router.push("/auth/sign-in")}
        >
          Already have an account? Sign In
        </Button>
      </form>
    </div>
  );
};
