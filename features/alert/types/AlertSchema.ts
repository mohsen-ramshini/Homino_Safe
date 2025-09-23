export interface BPData {
  systolic?: number;
  diastolic?: number;
}

export interface SensorData {
  bp?: BPData;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
  activity?: string;
  fallDetected?: boolean;
}

export interface AIModelOutput {
  explanation?: string;
  shapValues?: Record<string, number>;
}

export interface AlertType {
  alertId: string;
  userId: string;
  alertType: 'BP_DROP' | 'HR_SPIKE' | 'FALL_DETECTED' | 'OXYGEN_LOW' | 'TEMP_HIGH' | 'OTHER';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  predictedAt?: string;
  sensorData?: SensorData;
  aiModelOutput?: AIModelOutput;
  isAcknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  notes?: string;
}
