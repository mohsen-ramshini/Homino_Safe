import { cn } from "@/lib/utils";
import { BoxIcon } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
  optional?: boolean;
}

interface OnboardingSidebarProps {
  steps: OnboardingStep[];
  className?: string;
}

export const Sidebar = ({ steps, className }: OnboardingSidebarProps) => {
  return (
    <div
      className={cn(
        `
        relative flex min-h-screen w-80 flex-col
        bg-gradient-to-b
        from-[#ded9c9]
        via-[#cfc7af]
        to-[#bfb59b]
        p-6
        text-[#3b3a36]
        `,
        className
      )}
    >
      {/* Logo */}
      <div className="mb-12 flex items-center gap-3 pt-4">
        <BoxIcon className="size-6 text-[#6b6555]" />
        <span className="text-lg font-semibold tracking-tight text-[#3b3a36]">
          Seniosentry
        </span>
      </div>

      {/* Steps */}
      <div className="flex-1 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              `
              flex items-center gap-4 rounded-xl p-3
              transition-colors duration-200
              `,
              step.current && "bg-white/50 backdrop-blur-sm"
            )}
          >
            {/* Indicator */}
            <div
              className={cn(
                `
                flex h-7 w-7 flex-shrink-0 items-center justify-center
                rounded-full border
                `,
                step.completed
                  ? "border-[#8a7f63] bg-[#8a7f63]"
                  : step.current
                  ? "border-[#6b6555]"
                  : "border-[#6b6555]/40"
              )}
            >
              {step.completed ? (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : step.current ? (
                <div className="h-2.5 w-2.5 rounded-full bg-[#6b6555]" />
              ) : (
                <span className="text-xs font-medium text-[#6b6555]/70">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1">
              <div
                className={cn(
                  "text-sm font-medium",
                  step.current ? "text-[#3b3a36]" : "text-[#5f5a4b]"
                )}
              >
                {step.title}
              </div>
              {step.optional && (
                <div className="text-xs text-[#7a7462]">optional</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex justify-between pt-8 text-sm text-[#6b6555]">
        <span className="hover:underline cursor-pointer">
          Terms of Service
        </span>
        <span className="hover:underline cursor-pointer">
          Help Center
        </span>
      </div>
    </div>
  );
};
