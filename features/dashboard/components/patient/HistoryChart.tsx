// components/HistoryChart.tsx
"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { useEffect } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

type HistoryDataPoint = {
  timestamp: string;
  [metric: string]: number | string;
};

type HistoryChartProps = {
  data: HistoryDataPoint[];
  metric: string;
  unit?: string;
  className?: string;
};

export function HistoryChart({ data, metric, unit, className = "" }: HistoryChartProps) {
  // Debug: log the received data and check structure
  useEffect(() => {
    console.log("HistoryChart data prop:", data);
    if (!Array.isArray(data)) {
      console.error("HistoryChart: data is not an array", data);
    } else if (data.length > 0) {
      console.log("First data point:", data[0]);
    }
  }, [data]);

  // Flexible: support both {timestamp, value} and {timestamp, [metric]: number}
  const filteredData = Array.isArray(data)
    ? data.filter(
        (d) =>
          typeof d.timestamp === "string" &&
          (
            (d[metric] !== undefined && typeof d[metric] === "number") ||
            (d.value !== undefined && typeof d.value === "number")
          )
      )
    : [];

  // Pick the correct value for charting
  const getValue = (d: any) =>
    typeof d[metric] === "number"
      ? d[metric]
      : typeof d.value === "number"
      ? d.value
      : undefined;

  // Debug: log filtered data
  useEffect(() => {
    console.log("Filtered data for chart:", filteredData);
  }, [filteredData]);

  interface ChartDataSet {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
    pointRadius: number;
  }

  interface ChartData {
    labels: string[];
    datasets: ChartDataSet[];
  }

  const chartData: ChartData = {
    labels: filteredData.map((d) => d.timestamp),
    datasets: [
      {
        label: `${metric.replace("_", " ")}${unit ? ` (${unit})` : ""}`,
        data: filteredData.map(getValue) as number[],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.1)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.parsed.y} ${unit ?? ""}`,
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
          tooltipFormat: "yyyy/MM/dd HH:mm",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: unit ?? "",
        },
      },
    },
  };

  return (
    <div className={`rounded-xl p-4 transition-colors duration-300 bg-white dark:bg-zinc-800 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 capitalize">
        {metric.replace("_", " ")} over time
      </h2>
      {filteredData.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available.</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};
