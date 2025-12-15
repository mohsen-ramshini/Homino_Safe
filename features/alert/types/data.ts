import { AlertType } from './AlertSchema';

export const sampleAlerts: AlertType[] = [
  {
    alertId: 'alert-001',
    userId: 'user-123',
    alertType: 'BP_DROP',
    severity: 'high',
    timestamp: '2025-07-07T13:45:00Z',
    predictedAt: '2025-07-07T13:30:00Z',
    sensorData: {
      bp: { systolic: 139, diastolic: 86 },
      heartRate: 65,
      spo2: 99,
      temperature: 36.2,
      activity: 'Standing',
      fallDetected: false,
    },
    aiModelOutput: {
      explanation: 'Severe drop in blood pressure compared to normal values',
      shapValues: {
        bp_systolic: -0.45,
        bp_diastolic: -0.35,
        activity: 0.1,
      },
    },
    isAcknowledged: false,
    notes: '',
  },
  {
    alertId: 'alert-002',
    userId: 'user-123',
    alertType: 'FALL_DETECTED',
    severity: 'critical',
    timestamp: '2025-07-07T15:05:00Z',
    sensorData: {
      bp: { systolic: 120, diastolic: 80 },
      heartRate: 95,
      spo2: 98,
      temperature: 37,
      activity: 'Fall',
      fallDetected: true,
    },
    aiModelOutput: {
      explanation: 'High probability fall detected by CNN-BiLSTM model',
      shapValues: {
        activity: 0.75,
        fallDetected: 0.9,
      },
    },
    isAcknowledged: true,
    acknowledgedBy: 'caregiver-45',
    acknowledgedAt: '2025-07-07T15:10:00Z',
    notes: 'Caregiver is in contact with the patient.',
  },
];
