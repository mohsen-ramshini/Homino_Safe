"use client";

import { PatientInfoStep } from "./steps/PatientInfoStep";
import { ComorbiditiesStep } from "./steps/ComorbiditiesStep";
import { MedicationsStep } from "./steps/MedicationsStep";
import { SymptomsStep } from "./steps/SymptomsStep";
import { SuccessStep } from "./steps/SuccessStep";

interface OnboardingContentProps {
  currentStep: number;
  onContinue: (data: any) => void;
  onPrevious: () => void; // اضافه شد
}

export const Content = ({ currentStep, onContinue, onPrevious }: OnboardingContentProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Container داخل صفحه مرکزی */}
      <div className="w-full flex justify-center">
        {(() => {
          switch (currentStep) {
            case 0:
              return <PatientInfoStep onContinue={onContinue} />;
            case 1:
              return <ComorbiditiesStep onContinue={onContinue} onPrevious={onPrevious} />;
            case 2:
              return <MedicationsStep onContinue={onContinue} onPrevious={onPrevious} />;
            case 3:
              return <SymptomsStep onContinue={onContinue} onPrevious={onPrevious} />;
            case 4:
              return <SuccessStep status="failed"/>;
            default:
              return (
                <div className="min-h-screen flex justify-center items-center">
                  Step not found
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
};
