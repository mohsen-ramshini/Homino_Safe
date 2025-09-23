"use client";
import React, { useState } from "react";
import { DataTable } from "./table/data-table";
import { userColumns } from "./table/user-columns";
import { useGetAdminUsers } from "../api/use-get-users";
import { LoaderIcon } from "@/components/chat/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateUserDialog from "./dialog/CreateUserDialog";

const AdminDashboard = () => {
  const [filterOption, setFilterOption] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users, isLoading, error } = useGetAdminUsers();

  // modal state
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "caregiver" | "doctor" | ""
  >("");

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-8 h-8 text-blue-500 mb-2 flex items-center justify-center">
            <LoaderIcon size={32} />
          </div>
          <span className="text-muted-foreground">Loading user list...</span>
        </div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  let filteredData = users ?? [];
  if (filterOption === "non_covered") {
    filteredData = filteredData.filter(
      (user: { caregiver_id: number }) => user.caregiver_id === 0
    );
  }
  if (roleFilter !== "all") {
    filteredData = filteredData.filter(
      (user: { role?: string }) => user.role === roleFilter
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User List</h1>

      <div className="flex gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="caregiver">Caregiver</option>
        </select>
         <CreateUserDialog />
      </div>

      <DataTable columns={userColumns} data={filteredData} />
    </div>
  );
};

export default AdminDashboard;
