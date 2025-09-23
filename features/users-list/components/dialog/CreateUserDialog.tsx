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

const CreateUserDialog = () => {
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "caregiver" | "doctor" | ""
  >("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600">+ Create User</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {!selectedRole ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Select Role</DialogTitle>
              <DialogDescription>
                Choose what type of user you want to create.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedRole("patient")}
              >
                Patient
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedRole("caregiver")}
              >
                Caregiver
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedRole("doctor")}
              >
                Doctor
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>
                Create{" "}
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </DialogTitle>
              <DialogDescription>
                Fill out the form to create a new {selectedRole}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              {selectedRole === "patient" && (
                <CreatePatientForm setOpen={setOpen} />
              )}
              {selectedRole === "caregiver" && <CreateCaregiverForm setOpen={setOpen}/>}
              {selectedRole === "doctor" && <CreateDoctorForm setOpen={setOpen}/>}
            </div>

            <Button
              variant="ghost"
              className="mt-4 text-blue-600"
              onClick={() => setSelectedRole("")}
            >
              ← Back
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
