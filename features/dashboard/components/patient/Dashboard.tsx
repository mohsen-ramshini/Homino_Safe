import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import Ovreview from "./Ovreview";
import { OverviewSection } from "./OverviewSection";
import { useUser } from "@/context/UserContext";
import { useHistory } from "../../api/patient/useGetHistory";
import { HistoryChart } from "./HistoryChart";

type Metric =
  | "heart_rate"
  | "spo2"
  | "bp_systolic"
  | "bp_diastolic"
  | "temperature"
  | "body_temperature"
  | "humidity"
  | "mq2";

type OverviewData = {
  wearable: {
    timestamp: string;
    heart_rate: number;
    bp_systolic: number;
    bp_diastolic: number;
    spo2: number;
    activity: string;
    temperature: number;
  };
  environmental: {
    timestamp: string;
    temperature: number;
    humidity: number;
    MQ25: number;
    CO2: number;
  };
};


const heartRateList: number[] = [68];
const bpSystolicList: number[] = [122];
const bpDiastolicList: number[] = [71];
const spo2List: number[] = [95];
const temperatureList: number[] = [36.9];
const envTemperatureList: number[] = [
  25, 26, 24, 23, 22, 21, 22, 23, 24, 25, 26, 27, 28, 27, 26, 25, 24, 23, 22,
  21,
];
const humidityList: number[] = [
  50, 52, 54, 53, 51, 50, 49, 48, 50, 52, 54, 53, 51, 50, 49, 48, 50, 52, 54,
  53,
];
const mq25List: number[] = [
  15, 16, 14, 13, 12, 13, 14, 15, 16, 15, 14, 13, 12, 13, 14, 15, 16, 15, 14,
  13,
];
const co2List: number[] = [
  450, 455, 460, 458, 455, 452, 450, 448, 445, 450, 455, 460, 458, 455, 452,
  450, 448, 445, 450, 455,
];

function generateMockOverviewData(index: number): OverviewData {
  const now = new Date().toISOString();

  return {
    wearable: {
      timestamp: now,
      heart_rate: heartRateList[index],
      bp_systolic: bpSystolicList[index],
      bp_diastolic: bpDiastolicList[index],
      spo2: spo2List[index],
      activity: "Sitting",
      temperature: temperatureList[index],
    },
    environmental: {
      timestamp: now,
      temperature: envTemperatureList[index],
      humidity: humidityList[index],
      MQ25: mq25List[index],
      CO2: co2List[index],
    },
  };
}

const Dashboard = () => {
  const { user } = useUser();
  const [selectedMetric, setSelectedMetric] = useState<Metric>("heart_rate");

  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("day");

  const userId = user?.id ?? 0;

  // const metrics: Metric[] = ["heart_rate"];
  // const metric = metrics[0];

  const [heartRateIndex, setHeartRateIndex] = useState(0);
  const [metricIndex, setMetricIndex] = useState(0);
  const [mockOverviewData, setMockOverviewData] = useState<OverviewData>(
    generateMockOverviewData(0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const tehranTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tehran",
      });
      const tehranDate = new Date(tehranTime);
      const hour = tehranDate.getHours();
      const minute = tehranDate.getMinutes();

      if (hour === 17 && minute === 30) {
        setMetricIndex(0);
      } else {
        setMetricIndex((prev) => (prev + 1) % heartRateList.length);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMockOverviewData(generateMockOverviewData(metricIndex));
  }, [metricIndex]);

  const { data: historyData, isLoading: isHistoryLoading } = useHistory(
    userId,
    [selectedMetric],
    selectedPeriod
  );

  useEffect(() => {
    console.log("historyData:", historyData);
  }, [historyData]);

  const hasHistoryData =
    !!historyData &&
    !!historyData.data &&
    Array.isArray(
      (historyData.data as unknown as Record<string, any[]>)[selectedMetric]
    ) &&
    (historyData.data as unknown as Record<string, any[]>)[selectedMetric]
      .length > 0;

  return (
    <div className="w-full rounded-2xl flex flex-col gap-6 p-3 sm:p-6 bg-white dark:bg-zinc-900 transition-colors duration-300">
      {/* Row 1 */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between items-stretch">
        <div className="w-full xl:w-1/4 2xl:w-1/5 flex-shrink-0">
          <div className="h-full bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-colors duration-300">
            <ProfileCard />
          </div>
        </div>

        <div className="w-full xl:flex-1">
          <div className="h-full bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-colors duration-300">
            <Ovreview />
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between items-stretch">
        {/* Left Section */}
        <div className="w-full xl:w-1/2">
          <div className="h-full bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-colors duration-300">
            <OverviewSection data={mockOverviewData} />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full xl:w-1/2 flex flex-col">
          {/* ===== Header فیکس بالا ===== */}
          <div className="flex justify-between items-center mb-4 bg-white dark:bg-zinc-800 p-4 border-gray-200 dark:border-zinc-700 mt-5 rounded-lg">
            {/* عنوان سمت چپ */}
            <h2 className="text-lg font-semibold capitalize">History chart</h2>

            {/* فیلترها سمت راست */}
            <div className="flex gap-2">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as Metric)}
                className="rounded-lg border px-3 py-2 dark:bg-zinc-700"
              >
                {[
                  "heart_rate",
                  "spo2",
                  "bp_systolic",
                  "bp_diastolic",
                  "temperature",
                  "body_temperature",
                  "humidity",
                  "mq2",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m.replace("_", " ")}
                  </option>
                ))}
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) =>
                  setSelectedPeriod(e.target.value as "day" | "week" | "month")
                }
                className="rounded-lg border px-3 py-2 dark:bg-zinc-700"
              >
                {[
                  { label: "Last Day", value: "day" },
                  { label: "Last Week", value: "week" },
                  { label: "Last Month", value: "month" },
                ].map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Container با overflow و flex-grow */}
          <div className="flex-1 overflow-auto p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
            {isHistoryLoading ? (
              <p className="text-gray-500 dark:text-gray-300 text-center">
                Loading history...
              </p>
            ) : (
              <HistoryChart
                data={
                  (historyData.data as unknown as Record<string, any[]>)[
                    selectedMetric
                  ]
                }
                metric={selectedMetric}
                timePeriod={selectedPeriod}
                setMetric={() => {}}
                setTimePeriod={() => {}}
                unit={
                  historyData.units?.[
                    selectedMetric as keyof typeof historyData.units
                  ]
                }
                className=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
