"use client";

import { useState, useEffect } from "react";
import { CustomCalendar } from "../customField/CustomCalendar";
import { TimePicker } from "../customField/TimePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TimeSlot = { id: number; label: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onChange: (value: string) => void;
  setTimeRangeType: (id: number, label: string) => void;
  timeRange: TimeSlot[];
};

export const ScheduleDialog = ({
  open,
  onOpenChange,
  value,
  onChange,
  setTimeRangeType,
  timeRange,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      setSelectedTime(`${h}:${m}`);
    }
  }, [value, open]);

  const handleChoose = () => {
    if (!selectedDate || !selectedTime) return;

    const combined = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    combined.setHours(hours, minutes, 0, 0);
    onChange(combined.toISOString());
    onOpenChange(false);
  };

  const isButtonDisabled = !selectedDate || !selectedTime;

  return (
    <Dialog open={open} onOpenChange={(val) => onOpenChange(val)}>
      <DialogContent className="max-w-md w-full sm:rounded-md p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-base font-semibold">
            Select Date & Time
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Select when you'd like the agent to get in touch.
          </p>
        </DialogHeader>

        <div className="flex w-full flex-1 border-b border-gray-300">
          <div className="w-2/3 border-r border-gray-300">
            <CustomCalendar
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <div className="w-1/3">
            <TimePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onChange={setSelectedTime}
              setTimeRangeType={setTimeRangeType}
            />
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-4">
          <Button
            onClick={handleChoose}
            disabled={isButtonDisabled}
            className="w-60 h-11 text-white bg-[#7F56D9] hover:bg-[#6d48c7] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Choose
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
