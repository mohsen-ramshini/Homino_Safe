import { useState } from "react";
import type { Medication } from "@/features/medical-profile/types/medicalprofile";
import { Pill, ChevronDown } from "lucide-react";

export const MedicationsList = ({ medications }: { medications: Medication[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {medications.map((med) => (
        <div
          key={med.id}
          className="rounded-xl border border-blue-100 bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <button
            onClick={() => toggleOpen(med.id)}
            className="w-full px-4 py-3 flex justify-between items-center"
          >
            <div className="flex items-center space-x-3">
              <Pill className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-800">{med.name}</span>
            </div>

            <ChevronDown
              className={`h-5 w-5 text-blue-700 transition-transform duration-300 ${
                openId === med.id ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Details */}
          {openId === med.id && (
            <div className="px-5 py-4 bg-blue-50/60 border-t border-blue-100 text-sm space-y-2 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow label="Dosage" value={med.dosage} />
                <InfoRow label="Frequency" value={med.frequency} />
                <InfoRow label="Start Date" value={formatDate(med.start_date)} />
                <InfoRow label="End Date" value={formatDate(med.end_date)} />
              </div>

              {med.notes && (
                <p className="mt-2 text-gray-600 italic border-l-4 border-blue-300 pl-3">
                  {med.notes}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Small reusable info row
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <p className="text-gray-700">
    <span className="font-semibold text-blue-700">{label}: </span>
    {value}
  </p>
);

// Date formatting helper
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

export default MedicationsList;
