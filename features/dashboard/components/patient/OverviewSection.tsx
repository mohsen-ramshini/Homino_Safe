// components/OverviewSection.tsx
import { useState } from "react";
import { KpiCard } from "./KpiCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, HeartPulse, Activity, Droplets, Wind, Gauge, Cloud, Radiation } from "lucide-react";

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

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 transition-colors duration-300">
      <div className="w-full h-full flex flex-col gap-4">
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 dark:bg-zinc-700 p-1 rounded-xl transition-colors duration-300">
            <TabsTrigger
              value="vitals"
              className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-400 dark:data-[state=active]:text-zinc-900 transition-colors duration-300"
            >
              Vitals
            </TabsTrigger>
            <TabsTrigger
              value="environment"
              className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-400 dark:data-[state=active]:text-zinc-900 transition-colors duration-300"
            >
              Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="vitals"
            className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard
                title="Heart Rate"
                value={wearable.heart_rate}
                unit="bpm"
                icon={HeartPulse}
              />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard
                title="Blood Pressure"
                value={`${Math.round(wearable.bp_systolic)}/${Math.round(
                  wearable.bp_diastolic
                )}`}
                unit="mmHg"
                icon={Gauge}
              />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard
                title="SpO2"
                value={wearable.spo2}
                unit="%"
                icon={Droplets}
              />
            </div>
            <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-xl shadow">
              <KpiCard
                title="Temperature"
                value={wearable.temperature}
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
          </TabsContent>

          <TabsContent
            value="environment"
            className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
