"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomCalendar } from "../customField/CustomCalendar";
import { TimePicker } from "../customField/TimePicker";

type TimeSlot = {
  id: number;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  value?: string;
  onChange: (value: string) => void;
  setTimeRangeType: (id: number, label: string) => void;
  timeRange: TimeSlot[];
};

export const MobileScheduleDialog = ({
  open,
  onClose,
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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

    const startTime = selectedTime.split("-")[0].trim();
    const [time, modifier] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier?.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;

    const combined = new Date(selectedDate);
    combined.setHours(hours, minutes, 0, 0);

    onChange(combined.toISOString());
    onClose();
  };

  const isButtonDisabled = !selectedDate || !selectedTime;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="relative w-full rounded-t-2xl bg-white max-h-[95vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-base font-semibold">Select Date & Time</p>
                <p className="text-sm text-gray-500">
                  Select when you'd like the agent to get in touch
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <CustomCalendar
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />

              <TimePicker
                timeRange={timeRange}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onChange={setSelectedTime}
                setTimeRangeType={setTimeRangeType}
              />
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleChoose();
                }}
                disabled={isButtonDisabled}
                className={`w-full rounded-md py-2 text-sm font-medium text-white transition
                  ${
                    isButtonDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#7F56D9] hover:bg-[#6d48c7]"
                  }
                `}
              >
                Choose
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
