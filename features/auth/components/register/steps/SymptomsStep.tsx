"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

interface Props {
  onContinue: (data: any) => void;
  onPrevious?: () => void;
}

export const SymptomsStep = ({ onContinue, onPrevious }: Props) => {
  const [symptoms, setSymptoms] = useState([
    { name: "", notes: "", onset_date: "", severity: "" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...symptoms];
    updated[index][field] = value;
    setSymptoms(updated);
  };

  const addSymptom = () => {
    setSymptoms([...symptoms, { name: "", notes: "", onset_date: "", severity: "" }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#3b3a36]">
      {/* Container */}
      <div className="w-full max-w-5xl flex flex-col p-8 rounded-lg h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold mb-2">Symptoms</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Add the patient's symptoms. You can add multiple symptoms if needed.
          </p>
        </div>

        {/* Form fields with scroll */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {symptoms.map((symptom, index) => (
              <div key={index} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={symptom.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={symptom.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  placeholder="Onset Date"
                  value={symptom.onset_date}
                  onChange={(e) => handleChange(index, "onset_date", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Severity"
                  value={symptom.severity}
                  onChange={(e) => handleChange(index, "severity", e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            ))}
          </div>

          {/* Add new symptom */}
          <div className="mt-4">
            <button
              type="button"
              onClick={addSymptom}
              className="text-sm font-medium text-[#8a7f63] hover:underline"
            >
              + Add another symptom
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
            onClick={() => onContinue({ symptoms })}
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
