// types/history.ts
export interface HistoryData {
  data: any[]; // اگر ساختار دقیق داده‌ها مشخصه می‌تونی دقیق‌تر تعریفش کنی
  metrics: string[];
  units: {
    [metric: string]: string;
  };
  start_time: string;
  end_time: string;
  user_id: number;
}
