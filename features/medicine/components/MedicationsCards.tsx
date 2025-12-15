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
    return <p className="text-gray-700">No medications recorded.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {medications.map((med) => (
        <div
          key={med.id}
          className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all p-5"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <Pill className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">{med.name}</h3>
          </div>

          {/* Dosage & Frequency */}
          <p className="text-gray-700 text-sm">
            <span className="font-medium text-blue-700">Dosage:</span> {med.dosage}
          </p>
          <p className="text-gray-700 text-sm">
            <span className="font-medium text-blue-700">Frequency:</span> {med.frequency}
          </p>

          {/* Notes */}
          {med.notes && (
            <p className="mt-2 text-sm italic text-gray-600 border-l-2 border-blue-200 pl-2">
              {med.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicationsCards;
