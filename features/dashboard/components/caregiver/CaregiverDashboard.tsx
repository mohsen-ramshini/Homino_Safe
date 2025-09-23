import React, { useState } from 'react';
import { DataTable } from './table/data-table';
import { userColumns } from './table/user-columns';
import { usePatients } from '../../api/caregiver/useGetPatients';
import { LoaderIcon } from "@/components/chat/icons";

type FilterOption = "my_patients" | "all_users" | "non_covered";

const CaregiverDashboard = () => {
  // حالت فیلتر
  const [filterOption, setFilterOption] = useState<FilterOption>("my_patients");

  // مقدار patientsOnly بر اساس انتخاب فیلتر تعیین می‌شود
  // فقط زمانی patientsOnly true است که فیلتر روی "my_patients" باشد
  const patientsOnly = filterOption === "my_patients";

  // گرفتن داده با توجه به patientsOnly (برای همه یا فقط بیماران تحت پوشش)
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

  // فیلتر روی کاربران خارج از پوشش روی داده‌ها اعمال می‌شود
  // فرض: کاربر خارج از پوشش یعنی status === 'non_covered' یا هر شرط دلخواه شما
  const filteredData =
    filterOption === "non_covered"
      ? (patients ?? []).filter((user) => user.caregiver_id === 0)
      : patients ?? [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patient List</h1>

      <select
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value as FilterOption)}
        className="mb-4 rounded border px-3 py-2"
      >
        <option value="my_patients">Show only my patients</option>
        <option value="all_users">Show all users</option>
        <option value="non_covered">Show non-covered users</option>
      </select>

      <DataTable columns={userColumns} data={filteredData} />
    </div>
  );
};

export default CaregiverDashboard;
