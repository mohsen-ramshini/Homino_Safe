import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCaregiverForm from "../form/CreateCaregiverForm";
import CreateDoctorForm from "../form/CreateDoctorForm";
import CreatePatientForm from "../form/CreatePatientForm";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

const CreateUserDialog = () => {
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "caregiver" | "doctor" | ""
  >("");
  const [open, setOpen] = useState(false);

  // تعیین عرض مناسب Dialog بر اساس مرحله
  const dialogMaxWidth = !selectedRole ? "max-w-sm" : "max-w-5xl";

  return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button >+ Create User</Button>
    </DialogTrigger>

    {/* مرحله انتخاب role */}
    {!selectedRole && (
      <DialogContent className="!w-full max-w-sm p-6">
        <DialogHeader>
          <DialogTitle>Select Role</DialogTitle>
          <DialogDescription>
            Choose what type of user you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 mt-4">
          <Button variant="outline" className="w-full" onClick={() => setSelectedRole("patient")}>
            Patient
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setSelectedRole("caregiver")}>
            Caregiver
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setSelectedRole("doctor")}>
            Doctor
          </Button>
        </div>
      </DialogContent>
    )}

    {/* مرحله فرم */}
    {selectedRole && (
      <DialogContent className="!w-full !max-w-5xl p-6">
        <DialogHeader>
          <Button
            variant="ghost"
            style={{display:"flex",justifyContent:"flex-start",maxWidth:"150px"}}
            className="mt-4 text-blue-600 ml-0 pl-0"
            onClick={() => setSelectedRole("")}
          >
            <ArrowLeftIcon size={32} />
          </Button>
          <DialogTitle>Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new {selectedRole}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {selectedRole === "patient" && <CreatePatientForm setOpen={setOpen} />}
          {selectedRole === "caregiver" && <CreateCaregiverForm setOpen={setOpen} />}
          {selectedRole === "doctor" && <CreateDoctorForm setOpen={setOpen} />}
        </div>
      </DialogContent>
    )}
  </Dialog>
  );
};

export default CreateUserDialog;
