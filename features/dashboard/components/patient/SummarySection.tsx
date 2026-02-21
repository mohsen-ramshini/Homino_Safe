"use client";

import { FC, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type KPI = {
  value: number;
  trend: number | null;
  average_last_24h: number | null;
  average_last_7d: number | null;
  unit: string;
};

type RiskAssessment = {
  time: string;
  risk_level: string;
  predicted_condition: string;
  recommendation: string;
};

export type SummaryData = {
  user_id: number;
  last_updated: string;
  kpis: Record<string, KPI>;
  recent_alerts: string[];
  risk_assessments: RiskAssessment[];
  daily_overview: {
    date: string;
    avg_heart_rate: number | null;
    avg_spo2: number | null;
    max_bp_systolic: number | null;
    min_bp_diastolic: number | null;
  };
};

export function formatISODate(iso: string) {
  const date = new Date(iso);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export type SectionType = "kpis" | "daily" | "alerts" | "risk";

interface SummarySectionProps {
  data: SummaryData;
  activeSection: SectionType;
  onSectionChange?: (section: SectionType) => void;
  liveData?: object;
}

export const SummarySection: FC<SummarySectionProps> = ({
  data,
  activeSection,
  liveData,
}) => {
  const [metricIndex, setMetricIndex] = useState(0);

  const syncedKpis = {
    ...data.kpis,
    heart_rate: {
      ...data.kpis["heart_rate"],
      value: liveData?.wearable.heart_rate,
    },
    bp_systolic: {
      ...data.kpis["bp_systolic"],
      value: liveData?.wearable.bp_systolic,
    },
    bp_diastolic: {
      ...data.kpis["bp_diastolic"],
      value: liveData?.wearable.bp_diastolic,
    },
    spo2: { ...data.kpis["spo2"], value: liveData?.wearable.spo2 },
  };

  // ساخت KPI ترکیبی فشار خون
  const bpKpi: KPI = {
    value: {
      systolic: syncedKpis.bp_systolic.value,
      diastolic: syncedKpis.bp_diastolic.value,
    },
    trend:
      (syncedKpis.bp_systolic.trend ?? 0) +
      (syncedKpis.bp_diastolic.trend ?? 0),
    average_last_24h: {
      systolic: syncedKpis.bp_systolic.average_last_24h ?? 0,
      diastolic: syncedKpis.bp_diastolic.average_last_24h ?? 0,
    },
    average_last_7d: {
      systolic: syncedKpis.bp_systolic.average_last_7d ?? 0,
      diastolic: syncedKpis.bp_diastolic.average_last_7d ?? 0,
    },
    unit: "mmHg",
  };

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-800 rounded-xl  p-4 transition-colors duration-300 w-full max-w-full overflow-hidden">
      {/* KPI Section */}
      {activeSection === "kpis" && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <KpiCard
              key="heart_rate"
              name="heart_rate"
              kpi={syncedKpis["heart_rate"]}
            />
            <KpiCard key="blood_pressure" name="blood_pressure" kpi={bpKpi} />
            <KpiCard key="spo2" name="spo2" kpi={syncedKpis["spo2"]} />
          </div>
        </section>
      )}

      {/* Daily Overview Section */}
      {activeSection === "daily" && (
        <section className="flex justify-center items-center min-h-[200px] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-full">
            <OverviewCard
              label="Avg Heart Rate"
              value={data.daily_overview.avg_heart_rate}
              unit="bpm"
            />
            <OverviewCard
              label="Avg SpO2"
              value={data.daily_overview.avg_spo2}
              unit="%"
            />
            <OverviewCard
              label="Max BP Systolic"
              value={data.daily_overview.max_bp_systolic}
              unit="mmHg"
            />
            <OverviewCard
              label="Min BP Diastolic"
              value={data.daily_overview.min_bp_diastolic}
              unit="mmHg"
            />
          </div>
        </section>
      )}

      {/* Alerts */}
      {activeSection === "alerts" && (
        <section>
          {data.recent_alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              No recent alerts
            </p>
          ) : (
            <div className="space-y-2">
              {data.recent_alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 rounded-md p-2 shadow-sm text-sm"
                >
                  <TrendingDown className="text-yellow-500 w-4 h-4" />
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {alert}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Risk */}
      {activeSection === "risk" && (
        <section className="space-y-3">
          {data.risk_assessments.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              No risk assessments available
            </div>
          ) : (
            data.risk_assessments.map((risk, i) => {
              const levelColor =
                risk.risk_level === "high"
                  ? "red"
                  : risk.risk_level === "medium"
                  ? "yellow"
                  : "green";

              return (
                <div
                  key={i}
                  className={`rounded-lg border-l-4 p-3 shadow-sm bg-${levelColor}-50 dark:bg-${levelColor}-900/30 border-${levelColor}-400`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown
                        className={`w-4 h-4 text-${levelColor}-500`}
                      />
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${levelColor}-100 text-${levelColor}-800 dark:bg-${levelColor}-800 dark:text-${levelColor}-100`}
                      >
                        {risk.risk_level.toUpperCase()} RISK
                      </span>
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-300">
                      🕒 {formatISODate(risk.time)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="text-sm space-y-1 dark:text-gray-200">
                    <p>
                      <span className="font-medium">Predicted Condition:</span>{" "}
                      {risk.predicted_condition}
                    </p>

                    <div className="mt-2 p-2 rounded-md bg-white/70 dark:bg-black/20 border text-xs">
                      <span className="font-semibold block mb-1">
                        Recommended Action
                      </span>
                      <p>{risk.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}
    </div>
  );
};

const roundValue = (val: number | null | undefined): number | string => {
  if (val === null || val === undefined) return "N/A";
  return Math.round(val);
};

// کارت KPI اصلاح شده
const KpiCard = ({ name, kpi }: { name: string; kpi: KPI }) => {
  let TrendIcon = Minus;
  let trendColor = "text-gray-400";

  // محاسبه trend فقط برای عدد بودن
  const trendValue = typeof kpi.trend === "number" ? kpi.trend : null;

  if (trendValue !== null) {
    if (trendValue > 0) {
      TrendIcon = TrendingUp;
      trendColor = "text-green-500";
    } else if (trendValue < 0) {
      TrendIcon = TrendingDown;
      trendColor = "text-red-500";
    }
  }

  // نمایش value
  const displayValue =
    name === "blood_pressure" && typeof kpi.value === "object"
      ? `${Math.round(kpi.value.systolic)} / ${Math.round(kpi.value.diastolic)}`
      : typeof kpi.value === "number"
      ? Math.round(kpi.value)
      : kpi.value; // رشته هم پشتیبانی می‌کنه

  // نمایش avg ها برای BP به شکل ترکیبی
  const displayAvg24h =
    name === "blood_pressure" && kpi.average_last_24h
      ? `${Math.round(kpi.average_last_24h.systolic)} / ${Math.round(
          kpi.average_last_24h.diastolic
        )}`
      : roundValue(kpi.average_last_24h);

  const displayAvg7d =
    name === "blood_pressure" && kpi.average_last_7d
      ? `${Math.round(kpi.average_last_7d.systolic)} / ${Math.round(
          kpi.average_last_7d.diastolic
        )}`
      : roundValue(kpi.average_last_7d);

  return (
    <div className="border rounded-xl p-3 shadow-md bg-white dark:bg-zinc-900 flex flex-col transition-colors duration-300">
      <h3 className="text-base font-semibold capitalize mb-1 text-gray-900 dark:text-gray-100">
        {name.replace(/_/g, " ")}
      </h3>
      <div className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
        {displayValue}{" "}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {kpi.unit}
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-1 text-gray-800 dark:text-gray-300 text-xs">
        <div>24h Avg: {displayAvg24h ?? "N/A"}</div>
        <div>7d Avg: {displayAvg7d ?? "N/A"}</div>
        <div className="flex items-center gap-1">
          Trend: <TrendIcon className={`${trendColor} w-3 h-3`} />
          <span className={`${trendColor} text-xs`}>
            {trendValue !== null ? trendValue : "stable"}{" "}
            <span className="text-md">( based on your ehr )</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// helper برای اعداد معمولی
// const roundValue = (val: number | null | undefined): number | string => {
//   if (val === null || val === undefined) return "N/A";
//   return Math.round(val);
// };

const OverviewCard = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value !== null && value !== undefined ? Math.round(value) : "N/A"}
      </div>
      <div className="text-gray-400 dark:text-gray-400 text-sm">{unit}</div>
    </div>
  );
};
