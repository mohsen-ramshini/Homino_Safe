"use client";

import React, { useState } from "react";
import { AlertType } from "../types/AlertSchema";
import { sampleAlerts } from "../types/data";

type DoctorAction = "none" | "urgent" | "passed";

const severityMeta = {
  critical: {
    label: "Critical",
    color: "bg-transparent text-zinc-900",
    border: "border-zinc-900",
  },
  high: {
    label: "High",
    color: "bg-transparent text-zinc-700",
    border: "border-zinc-400",
  },
  medium: {
    label: "Medium",
    color: "bg-transparent text-zinc-500",
    border: "border-zinc-300",
  },
  low: {
    label: "Low",
    color: "bg-transparent text-zinc-400",
    border: "border-zinc-200",
  },
};

const AlertCardDoctor: React.FC<{ alert: AlertType }> = ({ alert }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<DoctorAction>("none");

  const handleUrgent = () => {
    setAction("urgent");
    console.log("URGENT COMMENT:", comment);
  };

  const handlePass = () => {
    setAction("passed");
    console.log("ALERT PASSED");
  };

  return (
    <div
      className={`max-w-4xl mx-auto mb-4 rounded-xl border-l-4 ${
        severityMeta[alert.severity].border
      } bg-white dark:bg-zinc-900 shadow-md transition hover:shadow-lg`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4"
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${severityMeta[alert.severity].color} ${
              alert.severity === "critical" ? "animate-pulse" : ""
            }`}
          />
          <span className="font-semibold text-blue-800 dark:text-blue-300">
            {alert.alertType.replace("_", " ")}
          </span>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full text-white ${severityMeta[alert.severity].color}`}
        >
          {severityMeta[alert.severity].label}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="p-4 pt-0 border-t dark:border-zinc-700 space-y-4 text-sm">
          {/* Time */}
          <div>
            <strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}
          </div>

          {/* Sensor Data */}
          {alert.sensorData && (
            <div>
              <strong>Vitals:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {alert.sensorData.heartRate && (
                  <li>Heart Rate: {alert.sensorData.heartRate} bpm</li>
                )}
                {alert.sensorData.spo2 && (
                  <li>SpO₂: {alert.sensorData.spo2}%</li>
                )}
                {alert.sensorData.temperature && (
                  <li>Temp: {alert.sensorData.temperature} °C</li>
                )}
              </ul>
            </div>
          )}

          {/* AI Explanation */}
          {alert.aiModelOutput && (
            <div>
              <strong>AI Insight:</strong>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {alert.aiModelOutput.explanation}
              </p>
            </div>
          )}

          {/* Doctor Comment */}
          <div>
            <strong>Doctor Comment:</strong>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write urgent medical comment..."
              className="mt-1 w-full rounded-lg border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleUrgent}
              disabled={!comment}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              Urgent Comment
            </button>

            <button
              onClick={handlePass}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600"
            >
              Pass / Dismiss
            </button>
          </div>

          {/* Status */}
          {action !== "none" && (
            <div className="text-xs text-gray-500 pt-2">
              Status:{" "}
              <span className="font-semibold">
                {action === "urgent" ? "Urgent Action Taken" : "Passed"}
              </span>
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

const DoctorAlertList: React.FC = () => {
  const [filter, setFilter] = useState<AlertType["severity"] | "all">("all");

  const alerts = sampleAlerts
    .filter((a) => filter === "all" || a.severity === filter)
    .sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-zinc-900 px-4 py-10">
      <h1 className="text-center text-2xl font-bold text-blue-800 dark:text-blue-400 mb-8">
        Doctor Alert Review Panel
      </h1>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-800"
          }`}
        >
          All
        </button>

        {severityOrder.map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white ${
              severityMeta[sev].color
            }`}
          >
            {severityMeta[sev].label}
          </button>
        ))}
      </div>

      {alerts.length === 0 ? (
        <p className="text-center text-gray-500">No alerts available</p>
      ) : (
        alerts.map((alert) => (
          <AlertCardDoctor key={alert.alertId} alert={alert} />
        ))
      )}
    </div>
  );
};

export default DoctorAlertList;
