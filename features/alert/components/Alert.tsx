"use client";
import React, { useState } from "react";
import { AlertType } from "../types/AlertSchema";
import { sampleAlerts } from "../types/data";

const severityColors: Record<
  AlertType["severity"],
  { light: string; dark: string }
> = {
  critical: { light: "bg-red-500", dark: "bg-red-700" },
  high: { light: "bg-orange-400", dark: "bg-orange-600" },
  medium: { light: "bg-yellow-300", dark: "bg-yellow-600" },
  low: { light: "bg-green-400", dark: "bg-green-700" },
};

const borderColors: Record<AlertType["severity"], string> = {
  critical: "border-red-500",
  high: "border-orange-400",
  medium: "border-yellow-300",
  low: "border-green-400",
};

const severityLabels: Record<AlertType["severity"], string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const CheckIcon = () => (
  <svg
    className="inline-block mr-1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="green"
    width="18"
    height="18"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const AlertCard: React.FC<{ alert: AlertType }> = ({ alert }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`max-w-3xl m-auto rounded-xl border-l-4 ${borderColors[alert.severity]} bg-white/80 dark:bg-zinc-900 shadow-md mb-4 transition-all hover:shadow-lg hover:scale-[1.02]`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 focus:outline-none"
      >
        <div className="flex items-center">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${
              alert.severity === "critical"
                ? "bg-red-500 animate-pulse"
                : alert.severity === "high"
                  ? "bg-orange-400 dark:bg-orange-600"
                  : alert.severity === "medium"
                    ? "bg-yellow-300 dark:bg-yellow-600"
                    : "bg-green-400 dark:bg-green-700"
            }`}
          />
          <span className="font-bold text-blue-800 dark:text-blue-400">
            Alert: {alert.alertType.replace("_", " ")}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${severityColors[alert.severity].light} dark:${severityColors[alert.severity].dark}`}
        >
          {severityLabels[alert.severity]}
        </span>
      </button>

      {open && (
        <div className="p-4 pt-0 text-gray-700 dark:text-gray-200 text-sm space-y-3 border-t border-gray-200 dark:border-zinc-700">
          <div>
            <strong>Time:</strong>
            <div className="ml-2">
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>

          {alert.predictedAt && (
            <div>
              <strong>Predicted Time:</strong>
              <div className="ml-2">
                {new Date(alert.predictedAt).toLocaleString()}
              </div>
            </div>
          )}

          {alert.sensorData && (
            <div>
              <strong>Sensor Data:</strong>
              <ul className="mt-1 pl-5 list-disc space-y-1">
                {alert.sensorData.bp && (
                  <li>
                    Blood Pressure: {alert.sensorData.bp.systolic}/
                    {alert.sensorData.bp.diastolic} mmHg
                  </li>
                )}
                {alert.sensorData.heartRate !== undefined && (
                  <li>Heart Rate: {alert.sensorData.heartRate} bpm</li>
                )}
                {alert.sensorData.spo2 !== undefined && (
                  <li>Oxygen Saturation: {alert.sensorData.spo2}%</li>
                )}
                {alert.sensorData.temperature !== undefined && (
                  <li>Body Temperature: {alert.sensorData.temperature} °C</li>
                )}
                {alert.sensorData.activity && (
                  <li>Activity: {alert.sensorData.activity}</li>
                )}
                {alert.sensorData.fallDetected !== undefined && (
                  <li>
                    Fall Detected:{" "}
                    {alert.sensorData.fallDetected ? "Yes" : "No"}
                  </li>
                )}
              </ul>
            </div>
          )}

          {alert.aiModelOutput && (
            <div>
              <strong>AI Model Explanation:</strong>
              <div className="ml-2">{alert.aiModelOutput.explanation}</div>
              {alert.aiModelOutput.shapValues && (
                <ul className="pl-5 list-disc text-xs mt-1 space-y-0.5">
                  {Object.entries(alert.aiModelOutput.shapValues).map(
                    ([key, val]) => (
                      <li key={key}>
                        {key}: {val.toFixed(2)}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          )}

          <div>
            <strong>Acknowledgement Status:</strong>
            <div className="ml-2">
              {alert.isAcknowledged ? (
                <span className="text-green-600 dark:text-green-400 inline-flex items-center">
                  <CheckIcon /> Acknowledged
                </span>
              ) : (
                <div className="flex flex-col">
                  <span className="text-red-600 dark:text-red-400">
                    <span className="text-gray-400 text-sm">by doctor : </span>
                    Not Acknowledged
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    <span className="text-gray-400 text-sm">by LLM : </span>Not
                    Acknowledged
                  </span>
                </div>
              )}
            </div>
          </div>

          {alert.isAcknowledged && (
            <>
              <div>
                <strong>Acknowledged By:</strong>
                <div className="ml-2">{alert.acknowledgedBy}</div>
              </div>
              <div>
                <strong>Acknowledged At:</strong>
                <div className="ml-2">
                  {alert.acknowledgedAt
                    ? new Date(alert.acknowledgedAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            </>
          )}

          {alert.notes && (
            <div>
              <strong>Notes:</strong>
              <div className="ml-2">{alert.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const severityOrder: AlertType["severity"][] = [
  "critical",
  "high",
  "medium",
  "low",
];

const AlertList: React.FC = () => {
  const [filter, setFilter] = useState<AlertType["severity"] | "all">("all");

  const filteredAlerts = sampleAlerts
    .filter((alert) => filter === "all" || alert.severity === filter)
    .sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <div className=" mx-auto py-10 px-4 sm:px-6 bg-blue-50 dark:bg-zinc-900 min-h-screen transition-colors duration-300">
      <h1 className="text-center mb-8 font-bold text-2xl text-blue-800 dark:text-blue-400">
        Health Alerts Dashboard
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200
            ${filter === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {severityOrder.map((sev) => (
          <button
            key={sev}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200
              ${filter === sev ? `${severityColors[sev].light} dark:${severityColors[sev].dark} text-white border-0` : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700"}`}
            onClick={() => setFilter(sev)}
          >
            {severityLabels[sev]}
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
          No alerts found.
        </p>
      ) : (
        filteredAlerts.map((alert) => (
          <AlertCard key={alert.alertId} alert={alert} />
        ))
      )}
    </div>
  );
};

export default AlertList;
