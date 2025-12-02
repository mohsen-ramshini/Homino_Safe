// hooks/useGetCurrentUser.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';



const fetchHistory = async () => {
  const response = await axiosInstance.get('/api/rooms/whoami');

  if (response.status !== 200) {
    throw new Error('Failed to fetch history data');
  }

  return response.data;
};

export type useCurrentUserResult = UseQueryResult<AxiosError>;

export const useGetCurrentUser = (userId: number, metrics: string[]): useCurrentUserResult => {
  return useQuery<AxiosError>({
    queryKey: ['whoami'],
    queryFn: () => fetchHistory(),
    enabled: !!userId && metrics.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
