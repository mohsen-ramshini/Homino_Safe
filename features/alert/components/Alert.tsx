"use client";
import React, { useState } from "react";
import { AlertType } from "../types/AlertSchema";
import { sampleAlerts } from "../types/data";

// رنگ‌ها برای تم روشن و تاریک
const severityColors: Record<AlertType["severity"], { light: string; dark: string }> = {
  critical: { light: "bg-red-500", dark: "bg-red-700" },
  high: { light: "bg-yellow-400", dark: "bg-yellow-600" },
  medium: { light: "bg-yellow-200", dark: "bg-yellow-700" },
  low: { light: "bg-green-200", dark: "bg-green-700" },
};

const borderColors: Record<AlertType["severity"], string> = {
  critical: "border-red-500",
  high: "border-yellow-400",
  medium: "border-yellow-300",
  low: "border-green-300",
};

const severityLabels: Record<AlertType["severity"], string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Check icon for acknowledged status
const CheckIcon = () => (
  <svg
    className="mr-1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="green"
    width="18"
    height="18"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertCard: React.FC<{ alert: AlertType }> = ({ alert }) => {
  // تعیین رنگ severity برای تم روشن/تاریک
  const severityBg =
    `bg-white dark:bg-zinc-900 border-l-4 ${borderColors[alert.severity]} transition-colors duration-300`;

  return (
    <div
      className={`rounded-xl p-5 mb-5 shadow ${severityBg} transition-colors duration-300 hover:shadow-lg hover:scale-[1.02] focus:scale-[1.02] outline-none`}
      tabIndex={0}
    >
      <header className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          <span className="inline-block align-middle mr-2">
            {alert.severity === "critical" && (
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            )}
            {alert.severity === "high" && (
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-600" />
            )}
            {alert.severity === "medium" && (
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-300 dark:bg-yellow-700" />
            )}
            {alert.severity === "low" && (
              <span className="inline-block w-3 h-3 rounded-full bg-green-400 dark:bg-green-700" />
            )}
          </span>
          Alert: <span className="capitalize">{alert.alertType.replace("_", " ")}</span>
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold 
            ${severityColors[alert.severity].light} dark:${severityColors[alert.severity].dark} text-white transition-colors duration-300`}
        >
          {severityLabels[alert.severity]}
        </span>
      </header>

      <section className="mt-2 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
        <p>
          <strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}
        </p>
        {alert.predictedAt && (
          <p>
            <strong>Predicted Time:</strong> {new Date(alert.predictedAt).toLocaleString()}
          </p>
        )}

        {alert.sensorData && (
          <>
            <strong>Sensor Data:</strong>
            <ul className="mt-1 mb-2 pl-5 list-disc">
              {alert.sensorData.bp && (
                <li>
                  Blood Pressure: {alert.sensorData.bp.systolic}/{alert.sensorData.bp.diastolic} mmHg
                </li>
              )}
              {alert.sensorData.heartRate !== undefined && <li>Heart Rate: {alert.sensorData.heartRate} bpm</li>}
              {alert.sensorData.spo2 !== undefined && <li>Oxygen Saturation: {alert.sensorData.spo2}%</li>}
              {alert.sensorData.temperature !== undefined && <li>Body Temperature: {alert.sensorData.temperature} °C</li>}
              {alert.sensorData.activity && <li>Activity: {alert.sensorData.activity}</li>}
              {alert.sensorData.fallDetected !== undefined && (
                <li>Fall Detected: {alert.sensorData.fallDetected ? "Yes" : "No"}</li>
              )}
            </ul>
          </>
        )}

        {alert.aiModelOutput && (
          <>
            <strong>AI Model Explanation:</strong>
            <p className="mt-1 mb-2">{alert.aiModelOutput.explanation}</p>
            {alert.aiModelOutput.shapValues && (
              <ul className="pl-5 list-disc">
                {Object.entries(alert.aiModelOutput.shapValues).map(([key, val]) => (
                  <li key={key} className="text-xs">
                    {key}: {val.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <p className="mt-3">
          <strong>Acknowledgement Status: </strong>
          {alert.isAcknowledged ? (
            <span className="text-green-600 dark:text-green-400 inline-flex items-center">
              <CheckIcon /> Acknowledged
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Not Acknowledged</span>
          )}
        </p>

        {alert.isAcknowledged && (
          <>
            <p>
              <strong>Acknowledged By:</strong> {alert.acknowledgedBy}
            </p>
            <p>
              <strong>Acknowledged At:</strong> {alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : "-"}
            </p>
          </>
        )}

        {alert.notes && alert.notes.trim() !== "" && (
          <p>
            <strong>Notes:</strong> {alert.notes}
          </p>
        )}
      </section>
    </div>
  );
};

const severityOrder: AlertType["severity"][] = ["critical", "high", "medium", "low"];

const AlertList: React.FC = () => {
  const [filter, setFilter] = useState<AlertType["severity"] | "all">("all");

  // مرتب‌سازی: critical > high > medium > low
  const filteredAlerts = sampleAlerts
    .filter((alert) => filter === "all" || alert.severity === filter)
    .sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 sm:px-6 bg-gray-50 dark:bg-zinc-800 min-h-screen transition-colors duration-300">
      <h1 className="text-center mb-8 font-bold text-2xl text-gray-900 dark:text-gray-100">
        Health Alerts Dashboard
      </h1>

      {/* فیلتر بر اساس سطح اهمیت */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200
            ${filter === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700"
            }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {severityOrder.map((sev) => (
          <button
            key={sev}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200
              ${filter === sev
                ? `${severityColors[sev].light} dark:${severityColors[sev].dark} text-white border-0`
                : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700"
              }`}
            onClick={() => setFilter(sev)}
          >
            {severityLabels[sev]}
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300 text-lg">No alerts found.</p>
      ) : (
        filteredAlerts.map((alert) => <AlertCard key={alert.alertId} alert={alert} />)
      )}
    </div>
  );
};

export default AlertList;
