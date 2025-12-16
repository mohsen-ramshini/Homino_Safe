"use client";

import { PatientInfoStep } from "./steps/PatientInfoStep";
import { ComorbiditiesStep } from "./steps/ComorbiditiesStep";
import { MedicationsStep } from "./steps/MedicationsStep";
import { SymptomsStep } from "./steps/SymptomsStep";
import { SuccessStep } from "./steps/SuccessStep";
import { useState } from "react";

interface OnboardingContentProps {
  currentStep: number;
  onContinue: (data: any) => void;
  onPrevious: () => void; // اضافه شد
}

export const Content = ({ currentStep, onContinue, onPrevious }: OnboardingContentProps) => {
  const [user, setUser] = useState();
  const [ehr, setEhr] = useState();
  const [registerationStatus, setRegisterationStatus] = useState()

  return (
    <div className="min-h-screen flex w-dvh justify-center">
      <div className="w-full max-w-5xl">
        {(() => {
          switch (currentStep) {  
            case 0:
              return <PatientInfoStep onContinue={onContinue} setUserInfo={setUser}/>;
            case 1:
              return <ComorbiditiesStep onContinue={onContinue} onPrevious={onPrevious} userEhr={ehr} setEhr={setEhr}/>;
            case 2:
              return <MedicationsStep onContinue={onContinue} onPrevious={onPrevious} userEhr={ehr} setEhr={setEhr}/>;
            case 3:
              return <SymptomsStep onContinue={onContinue} onPrevious={onPrevious} userInfo={user} userEhr={ehr} setEhr={setEhr} setRegisterationStatus={setRegisterationStatus}/>;
            case 4:
              return <SuccessStep status={registerationStatus} />;
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
