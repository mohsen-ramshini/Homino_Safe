"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

interface Props {
  onContinue: (data: any) => void;
  onPrevious?: () => void;
}

export const MedicationsStep = ({ onContinue, onPrevious }: Props) => {
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", notes: "", start_date: "" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", notes: "", start_date: "" }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#3b3a36]">
      {/* Container */}
      <div className="w-full max-w-5xl flex flex-col p-8 rounded-lg h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold mb-2">Medications</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Add medications for the patient. You can add multiple medications if needed.
          </p>
        </div>

        {/* Form grid with scroll */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {medications.map((med, index) => (
              <div key={index} className="flex flex-col gap-2">
                <input type="text" placeholder="Name" value={med.name} onChange={(e) => handleChange(index, "name", e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleChange(index, "dosage", e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handleChange(index, "frequency", e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="Notes" value={med.notes} onChange={(e) => handleChange(index, "notes", e.target.value)} className="border p-2 rounded" />
                <input type="date" placeholder="Start Date" value={med.start_date} onChange={(e) => handleChange(index, "start_date", e.target.value)} className="border p-2 rounded" />
              </div>
            ))}
          </div>

          {/* Add new medication */}
          <div className="mt-4">
            <button
              type="button"
              onClick={addMedication}
              className="text-sm font-medium text-[#8a7f63] hover:underline"
            >
              + Add another medication
            </button>
          </div>
        </div>

        {/* Action buttons always at bottom */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 underline px-4 py-2 rounded"
          >
            Previous Step
          </button>

          <Button
            onClick={() => onContinue({ medications })}
            size="lg"
            className="bg-[#8a7f63] text-white flex items-center gap-2"
          >
            Continue <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
