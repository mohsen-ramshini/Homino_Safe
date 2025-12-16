"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

interface Props {
  onContinue: (data: any) => void;
  onPrevious?: () => void;
  setEhr: (object) => void;
  userEhr: object;
}

export const ComorbiditiesStep = ({ onContinue, onPrevious, setEhr, userEhr }: Props) => {
  const [comorbidities, setComorbidities] = useState<{ name: string; value: string }[]>([
    { name: "Diabetes", value: "" },
    { name: "Hypertension", value: "" },
  ]);

  const handleChange = (index: number, fieldValue: string) => {
    const newData = [...comorbidities];
    newData[index].value = fieldValue;
    setComorbidities(newData);
  };

  const addComorbidity = () => {
    setComorbidities((prev) => [...prev, { name: "New Condition", value: "" }]);
  };

  const handleContinue = () => {
    // تبدیل آرایه به object
    const comorbiditiesObject = comorbidities.reduce((acc, curr) => {
      const key = curr.name.toLowerCase().replace(/\s+/g, "_");
      acc[key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const updatedEhr = {
      ...userEhr, // شامل داده‌های قبلی
      comorbidities: comorbiditiesObject,
    };
    console.log("updatedEhr",updatedEhr);
    

    setEhr(updatedEhr);

    // ارسال کل ehr به مرحله بعد
    onContinue(updatedEhr);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#3b3a36]">
      <div className="w-full max-w-5xl flex flex-col p-8 rounded-lg h-[80vh] overflow-hidden">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold mb-2">Comorbidities</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Add the patient's comorbidities. You can add more conditions if necessary.
          </p>
        </div>

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

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!onPrevious}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 underline px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Step
          </button>

          <Button
            onClick={handleContinue}
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
