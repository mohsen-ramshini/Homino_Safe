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
  risk_assessments: RiskAssessment[];  // <-- اصلاح اینجا
  daily_overview: {
    date: string;
    avg_heart_rate: number | null;
    avg_spo2: number | null;
    max_bp_systolic: number | null;
    min_bp_diastolic: number | null;
  };
};

// لیست‌های منطقی برای هر متریک (همانند Dashboard)
const heartRateList: number[] = [
  72, 74, 76, 78, 80, 82, 79, 77, 75, 73,
  71, 70, 69, 68, 70, 72, 74, 76, 78, 80
];
const bpSystolicList: number[] = [
  120, 122, 121, 119, 118, 117, 116, 115, 117, 119,
  121, 123, 124, 122, 120, 118, 117, 119, 121, 120
];
const bpDiastolicList: number[] = [
  80, 81, 79, 78, 77, 76, 75, 74, 76, 78,
  80, 82, 83, 81, 80, 78, 77, 79, 80, 81
];
const spo2List: number[] = [
  98, 97, 99, 98, 97, 96, 98, 99, 97, 98,
  99, 98, 97, 96, 98, 99, 98, 97, 99, 98
];

export type SectionType = "kpis" | "daily" | "alerts" | "risk";

interface SummarySectionProps {
  data: SummaryData;
  activeSection: SectionType;
  onSectionChange?: (section: SectionType) => void;
}

export const SummarySection: FC<SummarySectionProps> = ({
  data,
  activeSection,
}) => {
  // اندیس فعلی برای sync با dashboard
  const [metricIndex, setMetricIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // گرفتن ساعت تهران
      const tehranTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" });
      const tehranDate = new Date(tehranTime);
      const hour = tehranDate.getHours();
      const minute = tehranDate.getMinutes();

      // اگر ساعت 17:30 تهران بود، ریست کن
      if (hour === 17 && minute === 30) {
        setMetricIndex(0);
      } else {
        setMetricIndex((prev) => (prev + 1) % heartRateList.length);
      }
    }, 10 * 60 * 1000); // هر ده دقیقه
    return () => clearInterval(interval);
  }, []);

  // داده‌های KPI همگام با dashboard
  const syncedKpis = {
    ...data.kpis,
    heart_rate: {
      ...data.kpis["heart_rate"],
      value: heartRateList[metricIndex],
    },
    bp_systolic: {
      ...data.kpis["bp_systolic"],
      value: bpSystolicList[metricIndex],
    },
    bp_diastolic: {
      ...data.kpis["bp_diastolic"],
      value: bpDiastolicList[metricIndex],
    },
    spo2: {
      ...data.kpis["spo2"],
      value: spo2List[metricIndex],
    },
  };

  return (
    <div className="space-y-8 bg-white dark:bg-zinc-800 rounded-xl shadow p-4 transition-colors duration-300">
      {/* KPI Section */}
      {activeSection === "kpis" && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard key="heart_rate" name="heart_rate" kpi={syncedKpis["heart_rate"]} />
            </div>
            <div className="border rounded-xl p-5 shadow-md bg-white dark:bg-zinc-900 flex flex-col transition-colors duration-300">
              <h3 className="text-lg font-semibold capitalize mb-2 text-gray-900 dark:text-gray-100">Blood Pressure</h3>
              <div className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                {roundValue(syncedKpis["bp_systolic"].value)} / {roundValue(syncedKpis["bp_diastolic"].value)} <span className="text-base font-normal text-gray-500 dark:text-gray-400">mmHg</span>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard key="spo2" name="spo2" kpi={syncedKpis["spo2"]} />
            </div>
          </div>
        </section>
      )}

      {/* Daily Overview Section */}
      {activeSection === "daily" && (
        <section className="flex justify-center items-center min-h-[225px] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <OverviewCard label="Avg Heart Rate" value={data.daily_overview.avg_heart_rate} unit="bpm" />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <OverviewCard label="Avg SpO2" value={data.daily_overview.avg_spo2} unit="%" />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <OverviewCard label="Max BP Systolic" value={data.daily_overview.max_bp_systolic} unit="mmHg" />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <OverviewCard label="Min BP Diastolic" value={data.daily_overview.min_bp_diastolic} unit="mmHg" />
            </div>
          </div>
        </section>
      )}

      {/* Recent Alerts Section */}
      {activeSection === "alerts" && (
        <section>
          {data.recent_alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-sm">No recent alerts</p>
          ) : (
            <div className="space-y-3">
              {data.recent_alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 rounded-md p-3 shadow-sm">
                  <TrendingDown className="text-yellow-500 w-5 h-5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{alert}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Risk Assessments Section */}
      {activeSection === "risk" && (
        <section>
          {data.risk_assessments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-sm">No risk assessments</p>
          ) : (
            <div className="space-y-3">
              {data.risk_assessments.map((risk, i) => (
                <div
                  key={i}
                  className="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 rounded-md p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="text-red-500 w-5 h-5" />
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">Risk Level: {risk.risk_level}</p>
                  </div>
                  <p className="text-sm dark:text-gray-200"><strong>Time:</strong> {risk.time}</p>
                  <p className="text-sm dark:text-gray-200"><strong>Predicted Condition:</strong> {risk.predicted_condition}</p>
                  <p className="text-sm dark:text-gray-200"><strong>Recommendation:</strong> {risk.recommendation}</p>
                </div>
              ))}
            </div>
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

const KpiCard = ({ name, kpi }: { name: string; kpi: KPI }) => {
  // برای نمایش آیکن روند
  let TrendIcon = Minus;
  let trendColor = "text-gray-400";

  if (kpi.trend !== null) {
    if (kpi.trend > 0) {
      TrendIcon = TrendingUp;
      trendColor = "text-green-500";
    } else if (kpi.trend < 0) {
      TrendIcon = TrendingDown;
      trendColor = "text-red-500";
    }
  }

  return (
    <div className="border rounded-xl p-5 shadow-md bg-white dark:bg-zinc-900 flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-semibold capitalize mb-2 text-gray-900 dark:text-gray-100">{name.replace(/_/g, " ")}</h3>
      <div className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
        {roundValue(kpi.value)} <span className="text-base font-normal text-gray-500 dark:text-gray-400">{kpi.unit}</span>
      </div>
      <div className="mt-3 flex flex-col gap-1 text-gray-600 dark:text-gray-300 text-sm">
        <div>24h Avg: {roundValue(kpi.average_last_24h)}</div>
        <div>7d Avg: {roundValue(kpi.average_last_7d)}</div>
        <div className="flex items-center gap-1">
          Trend: <TrendIcon className={`${trendColor} w-4 h-4`} />
          <span className={`${trendColor}`}>
            {kpi.trend !== null ? kpi.trend : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

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
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value !== null && value !== undefined ? Math.round(value) : "N/A"}</div>
      <div className="text-gray-400 dark:text-gray-400">{unit}</div>
    </div>
  );
};
