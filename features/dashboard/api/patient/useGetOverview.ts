// hooks/useDashboardOverview.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { DashboardData } from '@/features/dashboard/types/patient/overview';
import { AxiosError } from 'axios';

// تابع fetch
const fetchDashboardOverview = async (userId: number): Promise<DashboardData> => {
  const response = await axiosInstance.get<DashboardData>('/api/dashboard/overview', {
    params: { user_id: userId },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.data;
};

// Hook
export const useDashboardOverview = (userId: number) => {
  return useQuery<DashboardData, AxiosError>({
    queryKey: ['dashboard-overview', userId],
    queryFn: () => fetchDashboardOverview(userId),
    enabled: !!userId, // وقتی userId مشخص بود اجرا بشه
    staleTime: 1000 * 60 * 1, // داده‌ها تا ۱ دقیقه کش بشن
  });
};
