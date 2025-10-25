import { FC } from "react";
import { AlertCircle, ClipboardList, CheckCircle } from "lucide-react";

export type Metric = {
  value: number;
  status: "normal" | "warning" | "critical";
  reference_range: string;
  recommendation: string;
  priority: "low" | "medium" | "high";
};

export type RecommendData = {
  timestamp: string;
  user_id: number;
  health_metrics: Record<string, Metric>;
  environment_metrics: Record<string, Metric>;
  general_recommendations: string[];
  alert_level_value: string; // expected: "0", "1", or "2"
};

export type SectionType = "daily" | "alerts" | "risk" | "kpis";

export const RecommendSection: FC<{
  data: RecommendData;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}> = ({ data, activeSection, onSectionChange }) => {
  const colorMap = {
    "0": "bg-green-100 text-green-700 border-green-300",
    "1": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "2": "bg-red-100 text-red-700 border-red-300",
  };

  const alertClass =
    colorMap[data.alert_level_value as keyof typeof colorMap] || "";

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl  p-4 transition-colors duration-300">
      <div className="space-y-5">
        {/* System Suggestions */}
        {activeSection === "alerts" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                System Suggestions
              </h2>
            </div>

            <ul className="space-y-3">
              {data.general_recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-1" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Overall Alert */}
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <span
            className={`px-3 py-1 rounded-full border text-sm font-semibold ${alertClass} bg-opacity-60 text-inherit`}
          >
            Overall Alert Level: {data.alert_level_value}
          </span>
        </div>
      </div>
    </div>
  );
};
