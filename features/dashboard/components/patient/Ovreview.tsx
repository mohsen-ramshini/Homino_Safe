"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SummarySection, SectionType } from "./SummarySection";
import { useSummary } from "../../api/patient/useGetSummary";
import { useUser } from "@/context/UserContext";
import { useRecommendation } from "../../api/patient/useGetRecommen";
import { RecommendSection } from "./RecommendSection";
import { Card } from "@/components/ui/card";

const AUTO_ROTATE_DELAY = 60000; // 1 دقیقه برای توقف خودکار

export default function Ovreview() {
  const { user } = useUser();
  const userId = user?.id ?? 0;

  const { data: recommendationData } = useRecommendation(userId);
  const { data: summaryData } = useSummary(userId);

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [summaryTab, setSummaryTab] = useState<SectionType>("kpis");

  const [isFading, setIsFading] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  // تعامل کاربر (با آپدیت زمان)
  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setLastInteractionTime(Date.now()); // فقط وقتی کاربر کلیک کنه
    setIsFading(true);
    setPendingTab(tab);
  };

  // حالت چرخش خودکار (بدون آپدیت زمان تعامل)
  const autoRotateTab = (tab: string) => {
    if (tab === activeTab) return;
    setIsFading(true);
    setPendingTab(tab);
  };

  useEffect(() => {
    if (!isFading || pendingTab === null) return;

    const timer = setTimeout(() => {
      setActiveTab(pendingTab);

      if (pendingTab === "overview") setSummaryTab("kpis");
      else if (pendingTab === "recommendation") setSummaryTab("alerts");
      else if (pendingTab === "risk") setSummaryTab("risk");

      setIsFading(false);
      setPendingTab(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [isFading, pendingTab]);

  useEffect(() => {
    const tabs = ["overview", "recommendation", "risk"];
    let index = tabs.indexOf(activeTab);

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTime;

      // اگر کاربر اخیراً تعامل داشته، چرخش نکن
      if (timeSinceLastInteraction < AUTO_ROTATE_DELAY) return;

      const nextIndex = (index + 1) % tabs.length;
      autoRotateTab(tabs[nextIndex]);
      index = nextIndex;
    }, 3500); // چرخش هر ۳.۵ ثانیه

    return () => clearInterval(interval);
  }, [activeTab, lastInteractionTime]);

  const renderTabContent = () => {
    if (activeTab === "overview" && summaryData) {
      return (
        <SummarySection
          key="overview"
          data={summaryData}
          activeSection={summaryTab}
          onSectionChange={setSummaryTab}
        />
      );
    }

    if (activeTab === "recommendation") {
      if (!recommendationData) return null;
      return (
        <RecommendSection
          key="recommendation"
          data={{
            ...recommendationData,
            alert_level_value:
              (recommendationData as any).alert_level_value ?? "0"
          }}
          activeSection={summaryTab}
          onSectionChange={setSummaryTab}
        />
      );
    }

    if (activeTab === "risk" && summaryData) {
      return (
        <SummarySection
          key="risk"
          data={summaryData}
          activeSection={summaryTab}
          onSectionChange={setSummaryTab}
        />
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 transition-colors duration-300">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full h-full space-y-4"
      >
        <TabsList
          className="w-full overflow-x-auto sm:overflow-visible flex sm:grid sm:grid-cols-3 gap-2 sm:gap-0 bg-gray-100 dark:bg-zinc-700 p-1 rounded-xl transition-colors duration-300 border-none"
        >
          <TabsTrigger
            value="overview"
            className={`min-w-max text-sm sm:text-base py-1 sm:py-0 px-3 sm:px-4 rounded-xl transition-colors duration-300
              data-[state=active]:bg-blue-600 data-[state=active]:text-white
              dark:data-[state=active]:bg-blue-400 dark:data-[state=active]:text-zinc-900
              text-gray-700 dark:text-gray-200
              data-[state=inactive]:bg-transparent
              data-[state=inactive]:text-gray-700
              dark:data-[state=inactive]:text-gray-200
            `}
          >
            Daily Overview
          </TabsTrigger>
          <TabsTrigger
            value="recommendation"
            className={`min-w-max text-sm sm:text-base py-1 sm:py-0 px-3 sm:px-4 rounded-xl transition-colors duration-300
              data-[state=active]:bg-blue-600 data-[state=active]:text-white
              dark:data-[state=active]:bg-blue-400 dark:data-[state=active]:text-zinc-900
              text-gray-700 dark:text-gray-200
              data-[state=inactive]:bg-transparent
              data-[state=inactive]:text-gray-700
              dark:data-[state=inactive]:text-gray-200
            `}
          >
            Recommendation
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className={`min-w-max text-sm sm:text-base py-1 sm:py-0 px-3 sm:px-4 rounded-xl transition-colors duration-300
              data-[state=active]:bg-blue-600 data-[state=active]:text-white
              dark:data-[state=active]:bg-blue-400 dark:data-[state=active]:text-zinc-900
              text-gray-700 dark:text-gray-200
              data-[state=inactive]:bg-transparent
              data-[state=inactive]:text-gray-700
              dark:data-[state=inactive]:text-gray-200
            `}
          >
            Risk
          </TabsTrigger>
        </TabsList>

        <div
          className={`transition-opacity duration-300 ease-in-out ${
            isFading ? "opacity-0 pointer-events-none" : "opacity-100"
          } h-[200px] overflow-y-auto pr-1`}
        >
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
};
