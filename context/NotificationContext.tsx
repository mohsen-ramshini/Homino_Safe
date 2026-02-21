"use client";
import React, { createContext, useContext, useState } from 'react';
import { AlertData, BehaviorAlertType, SmartSensorType } from '@/features/dashboard/types/patient/alert';

interface NotificationContextType {
  notifications: AlertData[];
  addNotification: (notification: AlertData) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Sample initial alerts for smart senior sensors
const sampleAlerts: AlertData[] = [
  {
    id: 'alert-ortho-001',
    timestamp: '2026-01-20T07:12:30Z',
    alert_type: 'predicted_orthostatic_hypotension' as BehaviorAlertType,
    severity: 'MEDIUM',
    message:
      'Predicted blood pressure instability following morning postural change',
    location: 'Bedroom',
    related_sensors: ['bp', 'heart_rate', 'activity'] as SmartSensorType[],
    details: {
      duration: 45 * 60, // predicted risk window: 45 minutes
      confidence: 0.91,
      sensor_readings: [
        {
          sensor_id: 'bp-wrist-01',
          sensor_type: 'bp',
          value: {
            systolic: 118,
            diastolic: 72,
            predicted_systolic_min: 98
          },
          timestamp: '2026-01-20T07:12:00Z',
        },
        {
          sensor_id: 'hr-wrist-01',
          sensor_type: 'heart_rate',
          value: 58,
          timestamp: '2026-01-20T07:12:00Z',
        },
        {
          sensor_id: 'activity-wrist-01',
          sensor_type: 'activity',
          value: 'Supine → Standing',
          timestamp: '2026-01-20T07:12:00Z',
        },
      ],
    },
    sensor_icon: undefined,
    read: false,
    sensor: undefined
  },
];


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AlertData[]>(sampleAlerts);

  const addNotification = (notification: AlertData) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // keep last 10 alerts
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
