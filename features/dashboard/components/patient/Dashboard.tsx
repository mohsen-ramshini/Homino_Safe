import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import Ovreview from "./Ovreview";
import { OverviewSection } from "./OverviewSection";
import { useUser } from "@/context/UserContext";
import { useHistory } from "../../api/patient/useGetHistory";
import { HistoryChart } from "./HistoryChart";
import { Card } from "@/components/ui/card";

type Metric = "heart_rate" | "spo2" | "blood_pressure";

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

// تابع تولید داده mock
const baseHeartRate : number = 75; // ضربان قلب پایه فرد ایستاده

// لیست منطقی از ضربان قلب برای ۲۰ بازه ده دقیقه‌ای (مثلاً بین 68 تا 90)
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
const temperatureList: number[] = [
  36.5, 36.6, 36.7, 36.8, 36.6, 36.5, 36.4, 36.3, 36.5, 36.6,
  36.7, 36.8, 36.6, 36.5, 36.4, 36.3, 36.5, 36.6, 36.7, 36.8
];
const envTemperatureList: number[] = [
  25, 26, 24, 23, 22, 21, 22, 23, 24, 25,
  26, 27, 28, 27, 26, 25, 24, 23, 22, 21
];
const humidityList: number[] = [
  50, 52, 54, 53, 51, 50, 49, 48, 50, 52,
  54, 53, 51, 50, 49, 48, 50, 52, 54, 53
];
const mq25List: number[] = [
  15, 16, 14, 13, 12, 13, 14, 15, 16, 15,
  14, 13, 12, 13, 14, 15, 16, 15, 14, 13
];
const co2List: number[] = [
  450, 455, 460, 458, 455, 452, 450, 448, 445, 450,
  455, 460, 458, 455, 452, 450, 448, 445, 450, 455
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
      activity: "Sitting", // ثابت
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
  const userId = user?.id ?? 0;

  const metrics: Metric[] = ["heart_rate"];
  const metric = metrics[0];

  // اندیس فعلی ضربان قلب
  const [heartRateIndex, setHeartRateIndex] = useState(0);
  const [metricIndex, setMetricIndex] = useState(0);

  // مقدار اولیه با اولین مقدار لیست
  const [mockOverviewData, setMockOverviewData] = useState<OverviewData>(
    generateMockOverviewData(0)
  );

  // هر ده دقیقه یکبار مقدار ضربان قلب را تغییر بده
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

  // هر بار که اندیس تغییر کرد، داده جدید بساز
  useEffect(() => {
    setMockOverviewData(generateMockOverviewData(metricIndex));
  }, [metricIndex]);

  // داده‌های واقعی API (فعلا برای تست کنار گذاشته شده)

  type HistoryDataType = {
    [key: string]: any[];
    // You can further specify the type if you know the structure of the array
  };

  const { data: historyData, isLoading: isHistoryLoading } = useHistory(userId, metrics);

  useEffect(() => {
    console.log("historyData:", historyData);
  }, [historyData]);

  const hasHistoryData =
    !!historyData &&
    !!historyData.data &&
    typeof historyData.data === "object" &&
    !Array.isArray(historyData.data) &&
    Array.isArray((historyData.data as { [key: string]: any[] })[metric]) &&
    (historyData.data as { [key: string]: any[] })[metric].length > 0;

  return (
    <div className="w-full rounded-2xl flex flex-col gap-4 p-2 sm:p-4 bg-white dark:bg-zinc-900 transition-colors duration-300">
      {/* Row 1 */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch h-auto xl:h-1/3">
        <div className="w-full xl:w-1/4 2xl:w-1/5">
          <div className="bg-white dark:bg-zinc-800 rounded-xl transition-colors duration-300">
            <ProfileCard />
          </div>
        </div>
        <div className="w-full xl:w-3/4 2xl:w-4/5">
          <div className="bg-white dark:bg-zinc-800 rounded-xl transition-colors duration-300">
            <Ovreview />
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch h-auto xl:h-2/3">
        {/* Left Section */}
        <div className="w-full xl:w-1/2">
          <div className="bg-white dark:bg-zinc-800 rounded-xl transition-colors duration-300">
            <OverviewSection data={mockOverviewData} />
          </div>
        </div>

        {/* Middle Section */}
        <Card className="w-full xl:w-1/2 h-full flex flex-col justify-between rounded-lg p-2 sm:p-4 shadow-md mt-4 xl:mt-0 bg-white dark:bg-zinc-800 transition-colors duration-300">
          <div className="w-full h-full">
            {isHistoryLoading ? (
              <p className="text-gray-500 dark:text-gray-300">Loading history...</p>
            ) : hasHistoryData ? (
              <HistoryChart
                data={((historyData.data as unknown) as Record<string, any[]>)[metric]}
                metric={metric}
                unit={historyData.units?.[metric as keyof typeof historyData.units]}
                // اضافه کردن کلاس تم به چارت
                className="bg-white dark:bg-zinc-800 rounded-xl transition-colors duration-300"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No history data to display.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
