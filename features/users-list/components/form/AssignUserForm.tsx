"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetUsersByRole } from "../../api/use-get-users-by-role";
import { useAssignUser } from "../../api/use-assign-to";
import { AnimatePresence, motion } from "framer-motion";

interface AssignUserFormProps {
  userId: number;
  setIsAssignFormOpen: (open: boolean) => void;
}

const AssignUserForm: React.FC<AssignUserFormProps> = ({
  userId,
  setIsAssignFormOpen,
}) => {
  const [assignUserId, setAssignUserId] = useState("");
  const [activeTab, setActiveTab] = useState<"caregiver" | "doctor">("caregiver");

  const { data: users, isLoading } = useGetUsersByRole(activeTab);
  const assignUser = useAssignUser(() => {
    setAssignUserId("");
    setIsAssignFormOpen(false);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      patient_id: Number(userId),
      role_assignment: activeTab,
      assign_user_id: Number(assignUserId),
    };
    console.log("🚀 Submitting:", payload);
    assignUser.mutate(payload);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* تب‌ها */}
      <div className="flex border-b mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("caregiver")}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === "caregiver"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Caregiver
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("doctor")}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === "doctor"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Doctor
        </button>
      </div>

      {/* فرم با انیمیشن */}
      <AnimatePresence mode="wait">
        <motion.form
          key={activeTab} // هر بار تب عوض میشه، این فرم دوباره mount میشه
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {activeTab === "caregiver" ? "Select Caregiver" : "Select Doctor"}
            </label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">{isLoading ? "Loading ..." : "Select"}</option>
              {users?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.username ?? `User ${user.id}`}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            className="bg-blue-600 text-white w-full"
          >
            {

               activeTab === "caregiver"
              ? "Assign Caregiver"
              : "Assign Doctor"}
          </Button>
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default AssignUserForm;
