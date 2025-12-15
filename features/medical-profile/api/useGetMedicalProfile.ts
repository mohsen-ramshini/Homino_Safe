// hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance'; // axios سفارشی
import { AxiosError } from 'axios';
import {ProfileData} from "@/features/medical-profile/types/medicalprofile"

// توابع درخواست API
const fetchProfile = async (): Promise<ProfileData> => {
  const response = await axiosInstance.get<ProfileData>('/api/profile/ehr');
  if (response.status !== 200) {
    throw new Error('Failed to fetch profile data');
  }
  return response.data;
};

// هوک useProfile
export const useProfile = () => {
  return useQuery<ProfileData, AxiosError>({
    queryKey: ['medical-profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // کش تا ۵ دقیقه
  });
};
