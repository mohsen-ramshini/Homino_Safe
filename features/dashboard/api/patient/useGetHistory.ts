// hooks/useHistory.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { HistoryData } from '@/features/dashboard/types/patient/history';
import { AxiosError } from 'axios';

interface HistoryParams {
  userId: number;
  metrics: string[];
}

const fetchHistory = async ({ userId, metrics }: HistoryParams): Promise<HistoryData> => {
  const response = await axiosInstance.get<HistoryData>('/api/dashboard/history', {
    params: {
      user_id: userId,
      metrics: metrics.join(','),
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch history data');
  }

  return response.data;
};

export type UseHistoryResult = UseQueryResult<HistoryData, AxiosError>;

export const useHistory = (userId: number, metrics: string[]): UseHistoryResult => {
  return useQuery<HistoryData, AxiosError>({
    queryKey: ['history', userId, metrics],
    queryFn: () => fetchHistory({ userId, metrics }),
    enabled: !!userId && metrics.length > 0,
    staleTime: 1000 * 60 * 5, // ۵ دقیقه کش
  });
};
