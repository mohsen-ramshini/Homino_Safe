"use client"
import React, { useState } from 'react';
import { DataTable } from './table/data-table';
import { userColumns } from './table/user-columns';
import { usePatients } from '../api/useGetPatients';
import { LoaderIcon } from "@/components/chat/icons";

type FilterOption = "my_patients" | "all_users" | "non_covered";

const CaregiverDashboard = () => {
  const [filterOption, setFilterOption] = useState<FilterOption>("my_patients");

  const patientsOnly = filterOption === "my_patients";


  const { data: patients, isLoading, error } = usePatients(patientsOnly);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin w-8 h-8 text-blue-500 mb-2 flex items-center justify-center">
        <LoaderIcon size={32} />
      </div>
      <span className="text-muted-foreground">Loading patient list...</span>
    </div>
  );
  if (error) return <p>Error: {error.message}</p>;

  const filteredData =
    filterOption === "non_covered"
      ? (patients ?? []).filter((user) => user.caregiver_id === 0)
      : patients ?? [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patient List</h1>
      <DataTable columns={userColumns} data={filteredData} />
    </div>
  );
};

export default CaregiverDashboard;
