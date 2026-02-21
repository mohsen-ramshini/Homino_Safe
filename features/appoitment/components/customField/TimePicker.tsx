"use client";

import { Calendar } from "lucide-react";

type TimeSlot = {
  id: number;
  label: string;
};

type Props = {
  selectedTime: string | null;
  timeRange: TimeSlot[];
  selectedDate: Date | null;
  onChange: (time: string) => void;
  setTimeRangeType: (id: number, label: string) => void;
};

const formatTimeRangeLabel = (label: string) => {
  const [start, end] = label.split("-").map((s) => s.trim());
  const [startTime, period] = start.split(" ");
  const [endTime] = end.split(" ");
  const startHour = Number(startTime.split(":")[0]);
  const endHour = Number(endTime.split(":")[0]);
  return `${startHour} - ${endHour} ${period}`;
};

export const TimePicker = ({
  selectedTime,
  timeRange,
  selectedDate,
  onChange,
  setTimeRangeType,
}: Props) => {
  return (
    <div className="h-full p-4 overflow-y-auto flex flex-col items-center">
      <p className="text-sm font-medium mb-3">
        {selectedDate ? (
          <>
            Free slots on{" "}
            <span className="font-semibold text-gray-900">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </>
        ) : (
          "Select a date first"
        )}
      </p>

      {selectedDate && timeRange.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-2 md:flex md:flex-col">
          {timeRange.map((slot) => {
            const isSelected = selectedTime === slot.label;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  onChange(slot.label);
                  setTimeRangeType(slot.id,slot.label);
                }}
                className={`w-full rounded-md flex justify-center items-center border px-3 py-2 text-sm transition
                  ${
                    isSelected
                      ? "border-[#7F56D9] bg-[#F5F3FF]"
                      : "border-gray-300 hover:bg-gray-100"
                  }
                `}
              >
                {formatTimeRangeLabel(slot.label)}
              </button>
            );
          })}
        </div>
      )}

      {!selectedDate && (
        <div className="flex-1 flex items-center justify-center mt-8">
          <Calendar className="h-16 w-16 text-gray-300" />
        </div>
      )}

      {selectedDate && timeRange.length === 0 && (
        <p className="text-sm text-gray-400 text-center mt-4">
          No available time slots for this date
        </p>
      )}
    </div>
  );
};
