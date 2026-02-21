// components/OverviewSection.tsx
import { useState } from "react";
import { KpiCard } from "./KpiCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Thermometer,
  HeartPulse,
  Activity,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Radiation,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useGetOVerview } from "../../api/patient/useGetOverview";

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

export function OverviewSection({ data }: { data: any }) {
  const { wearable, environmental } = data;
  const { user } = useUser();
  const userId = user?.id ?? 0;
  const { data: overViewData } = useGetOVerview(userId);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 transition-colors duration-300">
      <div className="w-full h-full flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          Environmental metrics
        </h2>

        {/* محتوای بخش Environment */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="Temperature"
              value={environmental.temperature}
              unit="°C"
              icon={Thermometer}
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="Humidity"
              value={environmental.humidity}
              unit="%"
              icon={Wind}
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="MQ25"
              value={environmental.MQ25}
              unit="ppm"
              icon={Radiation}
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="CO2"
              value={environmental.CO2}
              unit="ppm"
              icon={Cloud}
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="Body Temperature"
              value={overViewData?.wearable.temperature}
              unit="°C"
              icon={Thermometer}
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
            <KpiCard
              title="Activity"
              value={wearable.activity}
              icon={Activity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
