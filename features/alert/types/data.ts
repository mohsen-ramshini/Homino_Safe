import { AlertType } from "./AlertSchema";

export const sampleAlerts: AlertType[] = [
  {
    alertId: "alert-ortho-001",
    userId: "user-maria-001",
    alertType: "PREDICTED_ORTHOSTATIC_HYPOTENSION",
    severity: "medium",
    timestamp: "2026-01-20T07:12:30Z",
    predictedAt: "2026-01-20T07:12:00Z",
    sensorData: {
      bp: { systolic: 118, diastolic: 72 },
      heartRate: 58,
      spo2: 96,
      temperature: null,
      activity: "Postural transition (Supine → Standing)",
      fallDetected: false,
    },
    aiModelOutput: {
      explanation:
        "Predicted systolic blood pressure decline following postural change with insufficient heart rate compensation.",
      shapValues: {
        beta_blocker_effect: -0.42,
        diabetic_autonomic_impairment: -0.31,
        hfpEF_preload_sensitivity: -0.18,
        posture_change: 0.22,
      },
    },
    isAcknowledged: false,
    notes:
      "Moderate risk identified. No symptoms, arrhythmia, hypoxia, or fall detected. Monitoring trajectory.",
  },
];
