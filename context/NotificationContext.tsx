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
    id: 'alert-001',
    timestamp: '2025-06-11T10:15:00Z',
    alert_type: 'no_activity' as BehaviorAlertType,
    severity: 'HIGH',
    message: 'No activity detected for 3 hours in the living room',
    location: 'Living Room',
    related_sensors: ['motion', 'presence'] as SmartSensorType[],
    details: {
      duration: 3 * 60 * 60, // 3 hours in seconds
      confidence: 0.95,
      sensor_readings: [
        {
          sensor_id: 'motion-livingroom',
          sensor_type: 'motion',
          value: 0,
          timestamp: '2025-06-11T10:15:00Z',
        },
      ],
    },
    sensor_icon: undefined,
    read: false,
    sensor: undefined
  },
  {
    id: 'alert-002',
    timestamp: '2025-06-11T22:30:00Z',
    alert_type: 'night_activity' as BehaviorAlertType,
    severity: 'MEDIUM',
    message: 'Unusual night activity detected in the bedroom',
    location: 'Bedroom',
    related_sensors: ['motion', 'bed'] as SmartSensorType[],
    details: {
      duration: 30 * 60, // 30 minutes
      confidence: 0.88,
    },
    sensor_icon: undefined,
    read: false,
    sensor: undefined
  },
  {
    id: 'alert-003',
    timestamp: '2025-06-11T08:00:00Z',
    alert_type: 'possible_fall' as BehaviorAlertType,
    severity: 'HIGH',
    message: 'Possible fall detected in the hallway',
    location: 'Hallway',
    related_sensors: ['fall_detector'] as SmartSensorType[],
    details: {
      confidence: 0.92,
      sensor_readings: [
        {
          sensor_id: 'fall-hallway-01',
          sensor_type: 'fall_detector',
          value: true,
          timestamp: '2025-06-11T08:00:00Z',
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
