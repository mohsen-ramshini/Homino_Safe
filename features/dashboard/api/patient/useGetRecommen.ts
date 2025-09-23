// hooks/useRecommend.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { RecommendData } from '@/features/dashboard/types/patient/recommendation';
import { AxiosError } from 'axios';

const fetchRecommendation = async (userId: number): Promise<RecommendData> => {
  const response = await axiosInstance.get<RecommendData>('/api/dashboard/recommend', {
    params: { user_id: userId },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch recommendation');
  }

  return response.data;
};
export const useRecommendation = (userId: number) => {
  return useQuery<RecommendData, AxiosError>({
    queryKey: ['recommendation', userId],
    queryFn: () => fetchRecommendation(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // ۵ دقیقه کش
  });
};
