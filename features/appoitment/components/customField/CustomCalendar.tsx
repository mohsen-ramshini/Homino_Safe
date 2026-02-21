"use client";

import { JSX, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  addDays,
  startOfDay,
  isBefore,
} from "date-fns";

type Props = {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
};

export const CustomCalendar = ({ selectedDate, onChange }: Props) => {
  const today = startOfDay(new Date());

  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate ?? today);

  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    selectedDate
  );

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (isBefore(endOfMonth(prevMonth), today)) return;
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    if (
      isBefore(day, today) ||
      (internalSelectedDate && isSameDay(day, internalSelectedDate))
    ) {
      return;
    }

    setInternalSelectedDate(day);
    onChange(day);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const isPastDay =
          isSameMonth(cloneDay, monthStart) && isBefore(cloneDay, today);

        const isSelected =
          internalSelectedDate && isSameDay(cloneDay, internalSelectedDate);

        days.push(
          <div
            key={cloneDay.toISOString()}
            onClick={() => !isPastDay && handleDateClick(cloneDay)}
            className={`flex h-10 w-10 flex-col items-center justify-center text-sm
    ${
      isPastDay
        ? "cursor-not-allowed text-gray-300"
        : isSelected
        ? "bg-[#7F56D9] text-white cursor-pointer rounded-xl"
        : isSameMonth(cloneDay, monthStart)
        ? "cursor-pointer text-gray-900 hover:bg-gray-200 rounded-xl"
        : "text-gray-400 cursor-default"
    }`}
          >
            {/* Day number */}
            <span className="leading-none">{format(cloneDay, "d")}</span>

            {/* White dot for selected day */}
            {isSelected && (
              <span className="mt-1.5 h-1.25 w-1.25 rounded-full bg-white" />
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="flex justify-between">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="flex flex-col gap-1">{rows}</div>;
  };

  return (
    <div className="flex h-full flex-col border p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded px-2 py-1 hover:bg-gray-200"
        >
          {"<"}
        </button>

        <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded px-2 py-1 hover:bg-gray-200"
        >
          {">"}
        </button>
      </div>

      {/* Week days */}
      <div className="mb-1 grid grid-cols-7 text-center text-sm font-semibold text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="flex-1">{renderDays()}</div>
    </div>
  );
};
