import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { ScheduleTime } from "../types";

const fetchScheduleTimes = async (): Promise<ScheduleTime[]> => {
  const response = await apiClient.get("/api/schedule-times");

  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const useScheduleTimes = () =>
  useQuery<ScheduleTime[], Error>({
    queryKey: ["schedule-times"],
    queryFn: fetchScheduleTimes,
  });
