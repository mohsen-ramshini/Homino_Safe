"use client";

import { useState } from "react";
import { ScheduleDialog } from "../dialog/ScheduleDialog";
import { MobileScheduleDialog } from "../dialog/MobileScheduleDialog";
import { useMobile } from "@/lib/hooks/useMobile";
import { useScheduleTimes } from "../../api/use-schedule-times";
import { Button } from "@/components/ui/button";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  setTimeRangeType: (id: number, label: string) => void;
};

export const CalendarField = ({
  value,
  onChange,
  error,
  setTimeRangeType,
}: Props) => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const {
    status: scheduleStatus,
    data: scheduleData,
    isFetching: scheduleFetching,
  } = useScheduleTimes();

  const isLoading = scheduleStatus === "pending" || scheduleFetching;
  const hasError = scheduleStatus === "error";

  const displayValue = value
    ? `${new Date(value).toLocaleDateString()} ${new Date(
        value
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "";

  const handleOpen = () => {
    if (!isLoading && !hasError) {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="mt-2">
        <Button
          onClick={handleOpen}
          className="w-full justify-between cursor-pointer"
        >
          Create Appointment
        </Button>
      </div>

      {!isLoading && !hasError && (
        <>
          {isMobile ? (
            <MobileScheduleDialog
              open={open}
              onClose={() => setOpen(false)}
              value={value}
              onChange={onChange}
              setTimeRangeType={setTimeRangeType}
              timeRange={scheduleData}
            />
          ) : (
            <ScheduleDialog
              open={open}
              onOpenChange={setOpen}
              value={value}
              onChange={onChange}
              setTimeRangeType={setTimeRangeType}
              timeRange={scheduleData}
            />
          )}
        </>
      )}
    </>
  );
};
