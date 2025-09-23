import { useState } from "react";
import type { Medication } from "@/features/medical-profile/types/medicalprofile";

export const MedicationsList = ({ medications }: { medications: Medication[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="divide-y divide-gray-200 border rounded-md">
      {medications.map((med) => (
        <div key={med.id}>
          <button
            onClick={() => toggleOpen(med.id)}
            className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none hover:bg-gray-50"
          >
            <span className="font-semibold">{med.name}</span>
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${
                openId === med.id ? "rotate-180" : "rotate-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openId === med.id && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Dosage:</strong> {med.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {med.frequency}
              </p>
              {med.notes && <p className="italic">{med.notes}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicationsList;
