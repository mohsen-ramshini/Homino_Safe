"use client";

import { FC, useMemo, useState, ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CalendarField } from "./customField/CalendarField";

// -----------------------------
// Types
// -----------------------------
type AppointmentStatus = "upcoming" | "completed" | "cancelled";

interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  time: string;
  physician: string;
  specialty: string;
  location: string;
  status: AppointmentStatus;
}

// -----------------------------
// Mock Data
// -----------------------------
const mockAppointments: Appointment[] = [
  {
    id: 1,
    date: "2026-01-29",
    time: "09:30",
    physician: "Dr. Sarah Collins",
    specialty: "Cardiology",
    location: "Clinic  – Room 203",
    status: "upcoming",
  },
  {
    id: 2,
    date: "2026-01-29",
    time: "14:00",
    physician: "Dr. Michael Reed",
    specialty: "Endocrinology",
    location: "Clinic  – Room 114",
    status: "upcoming",
  },
  {
    id: 3,
    date: "2026-01-30",
    time: "10:00",
    physician: "Dr. Laura Kim",
    specialty: "Internal Medicine",
    location: "Clinic  – Room 101",
    status: "completed",
  },
];

// -----------------------------
// Helpers
// -----------------------------
const statusBadge: Record<AppointmentStatus, ReactNode> = {
  upcoming: (
    <span className="flex items-center gap-1 text-xs text-blue-700 font-semibold">
      <Clock className="h-3 w-3" /> Upcoming
    </span>
  ),
  completed: (
    <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
      <CheckCircle className="h-3 w-3" /> Completed
    </span>
  ),
  cancelled: (
    <span className="flex items-center gap-1 text-xs text-red-700 font-semibold">
      <AlertTriangle className="h-3 w-3" /> Cancelled
    </span>
  ),
};

const generateMonthDays = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// -----------------------------
// Component
// -----------------------------
const AppointmentPage: FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );
  const [showForm, setShowForm] = useState(false);

  const monthDays = useMemo(
    () => generateMonthDays(currentYear, currentMonth),
    [currentMonth, currentYear],
  );

  const appointmentDates = useMemo(
    () => new Set(mockAppointments.map((a) => a.date)),
    [],
  );

  const appointmentsForDay = mockAppointments.filter(
    (a) => a.date === selectedDate,
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 flex justify-center">
      <div className="w-full max-w-6xl space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
            Appointments
          </h1>
          <p className="text-gray-500 text-lg">
            Manage your medical visits easily
          </p>
        </div>

        <div className="flex justify-end">
          {/* <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showForm ? "Close Form" : "Create Appointment"}
          </Button> */}
          <CalendarField
            onChange={function (value: string): void {
              throw new Error("Function not implemented.");
            }}
            setTimeRangeType={function (id: number, label: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>

        {showForm && (
          <Card className="rounded-2xl border border-blue-200 bg-white p-6 shadow-md space-y-4">
            <CardTitle className="text-lg font-semibold text-blue-800">
              New Appointment
            </CardTitle>
            <CardContent>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Physician Name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Specialty"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Save Appointment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-md">
            <CardHeader className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="hover:bg-blue-50"
                >
                  <ChevronLeft className="h-5 w-5 text-blue-600" />
                </Button>

                <CardTitle className="text-lg font-semibold text-blue-800">
                  {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="hover:bg-blue-50"
                >
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
            </CardHeader>
            <Separator className="bg-blue-100" />
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {monthDays.map((day) => {
                  const iso = day.toISOString().split("T")[0];
                  const hasAppointment = appointmentDates.has(iso);
                  const isSelected = iso === selectedDate;
                  const isPast = day < today;

                  return (
                    <button
                      key={iso}
                      onClick={() => setSelectedDate(iso)}
                      disabled={isPast}
                      className={`relative rounded-xl py-2 transition-all
                        ${
                          isSelected
                            ? "bg-blue-600 text-white font-semibold"
                            : isPast
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "hover:bg-blue-50"
                        }
                      `}
                    >
                      <span className="font-medium">{day.getDate()}</span>
                      {hasAppointment && !isPast && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-gray-500">
                ● Colored days indicate scheduled appointments
              </p>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-blue-800">
                    {selectedDate}
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator className="bg-blue-100" />
              <CardContent className="pt-4 space-y-4">
                {appointmentsForDay.length === 0 ? (
                  <div className="border-blue-100 bg-blue-50 text-blue-700">
                    No appointments scheduled for this day. Use the button above
                    to create one.
                  </div>
                ) : (
                  appointmentsForDay.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-blue-100 p-4 hover:shadow-lg transition duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            <p className="font-semibold text-blue-800">
                              {appointment.physician}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            {appointment.location}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="font-medium text-blue-800">
                            {appointment.time}
                          </p>
                          {statusBadge[appointment.status]}
                        </div>
                      </div>

                      {appointment.status === "upcoming" && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="border-blue-200 text-blue-700"
                          >
                            Reschedule
                          </Button>
                          <Button variant="destructive">Cancel</Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
