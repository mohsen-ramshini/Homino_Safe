import React from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
}

export function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl shadow p-4 flex flex-col items-center",
        "bg-white text-gray-900",
        "dark:bg-zinc-900 dark:text-gray-100",
        "transition-colors duration-300"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-semibold">{title}</span>
      </div>
      <div className="text-3xl font-bold">
        {value}
        {unit && (
          <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

