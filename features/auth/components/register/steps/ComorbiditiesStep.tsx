"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

interface Props {
  onContinue: (data: any) => void;
  onPrevious?: () => void;
}

export const ComorbiditiesStep = ({ onContinue, onPrevious }: Props) => {
  const [comorbidities, setComorbidities] = useState<{ name: string; value: string }[]>([
    { name: "Diabetes", value: "" },
    { name: "Hypertension", value: "" },
  ]);

  const handleChange = (index: number, fieldValue: string) => {
    setComorbidities((prev) => {
      const newData = [...prev];
      newData[index].value = fieldValue;
      return newData;
    });
  };

  const addComorbidity = () => {
    setComorbidities((prev) => [...prev, { name: "New Condition", value: "" }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#3b3a36]">
      {/* Main container */}
      <div className="w-full max-w-5xl flex flex-col p-8 rounded-lg h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold mb-2">Comorbidities</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Add the patient's comorbidities. You can add more conditions if necessary.
          </p>
        </div>

        {/* Form grid with scroll */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comorbidities.map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{item.name}</label>
                <input
                  type="text"
                  placeholder={`Enter ${item.name}`}
                  value={item.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            ))}
          </div>

          {/* Add new comorbidity */}
          <div className="mt-4">
            <button
              type="button"
              onClick={addComorbidity}
              className="text-sm font-medium text-[#8a7f63] hover:underline"
            >
              + Add another condition
            </button>
          </div>
        </div>

        {/* Action buttons at the bottom */}
        <div className="mt-6 flex justify-between">
          {/* Previous Step always visible */}
          <button
            type="button"
            onClick={onPrevious}
            disabled={!onPrevious}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 underline px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Step
          </button>

          <Button
            onClick={() => onContinue(comorbidities)}
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
