"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/features/auth/components/register/Sidebar";
import { Content } from "@/features/auth/components/register/Content";

const onboardingSteps = [
  { id: "patient-info", title: "Patient Information", completed: false, current: true },
  { id: "comorbidities", title: "Comorbidities", completed: false, current: false },
  { id: "medications", title: "Medications", completed: false, current: false },
  { id: "symptoms", title: "Symptoms", completed: false, current: false },
  { id: "success", title: "Registration Completed", completed: false, current: false },
];

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(onboardingSteps);

  const handleContinue = (data: any) => {
    console.log("Onboarding data:", data);

    const newSteps = steps.map((step, index) => {
      if (index < currentStep + 1) return { ...step, completed: true, current: false };
      if (index === currentStep + 1) return { ...step, current: true };
      return { ...step, current: false };
    });

    setSteps(newSteps);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    const newSteps = steps.map((step, index) => {
      if (index === currentStep) return { ...step, current: false, completed: false };
      if (index === currentStep - 1) return { ...step, current: true };
      return step;
    });

    setSteps(newSteps);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <Sidebar steps={steps} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center">
        <Content
          currentStep={currentStep}
          onContinue={handleContinue}
          onPrevious={handlePrevious}
        />
      </div>

      {/* Mobile step indicator */}
      <div className="border-onboarding-option-border fixed right-0 bottom-0 left-0 border-t p-4 lg:hidden">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                step.completed
                  ? "bg-accent"
                  : step.current
                    ? "bg-primary"
                    : "bg-onboarding-option-border"
              )}
            />
          ))}
        </div>
        <div className="mt-2 text-center">
          <span className="text-onboarding-text-muted font-inter text-sm">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
