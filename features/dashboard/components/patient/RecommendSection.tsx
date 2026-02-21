import { FC } from "react";
import { AlertCircle, ClipboardList, CheckCircle } from "lucide-react";

/* =======================
   Types
======================= */

export type Metric = {
  value: number;
  status: "normal" | "warning" | "critical";
  reference_range: string;
  recommendation: string;
  priority: "low" | "medium" | "high";
};

export type RecommendData = {
  timestamp: string; // ISO
  user_id: number;
  health_metrics: Record<string, Metric>;
  environment_metrics: Record<string, Metric>;
  general_recommendations: string[];
  alert_level_value: "0" | "1" | "2";
};

export type SectionType = "daily" | "alerts" | "risk" | "kpis";

/* =======================
   Alert Meta
======================= */

const alertMeta = {
  "0": {
    label: "Low Risk",
    description: "All monitored parameters are within safe ranges.",
    className:
      "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:text-green-200",
    icon: CheckCircle,
  },
  "1": {
    label: "Moderate Risk",
    description: "Some parameters require closer attention.",
    className:
      "bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    icon: AlertCircle,
  },
  "2": {
    label: "High Risk",
    description: "Immediate medical attention is recommended.",
    className:
      "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:text-red-200",
    icon: AlertCircle,
  },
};

/* =======================
   Date Formatter
======================= */

function formatISODate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/* =======================
   Component
======================= */

export const RecommendSection: FC<{
  data: RecommendData;
  activeSection: SectionType;
}> = ({ data, activeSection }) => {
  const alert = alertMeta[data.alert_level_value];
  const AlertIcon = alert.icon;

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-xl p-4 space-y-6 transition-colors">
      {/* ===== Overall Health Status ===== */}
      <div
        className={`flex items-start gap-3 border rounded-lg p-3 ${alert.className}`}
      >
        <AlertIcon className="w-6 h-6 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">
              Overall Health Status: {alert.label}
            </p>
            <span className="text-xs opacity-70">
              {formatISODate(data.timestamp)}
            </span>
          </div>
          <p className="text-xs opacity-80 mt-1">{alert.description}</p>
        </div>
      </div>

      {/* ===== System Recommendations ===== */}
      {activeSection === "alerts" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              System Recommendations
            </h2>
          </div>

          {data.general_recommendations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No recommendations at this time
            </p>
          ) : (
            <ul className="space-y-2">
              {data.general_recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-md bg-blue-50/70 dark:bg-blue-900/20 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-gray-100">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
