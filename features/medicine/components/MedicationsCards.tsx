import React from "react";
import { Pill } from "lucide-react";

interface Medication {
  id: number | string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

interface Props {
  medications: Medication[];
}

const MedicationsCards: React.FC<Props> = ({ medications }) => {
  if (medications.length === 0) {
    return <p>No medications recorded.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {medications.map((med) => (
        <div
          key={med.id}
          className="border rounded-lg shadow-sm hover:shadow-md transition p-5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Pill className="h-6 w-6 text-indigo-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold">{med.name}</h3>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Dosage:</span> {med.dosage}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Frequency:</span> {med.frequency}
          </p>
          {med.notes && (
            <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
              {med.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicationsCards;
