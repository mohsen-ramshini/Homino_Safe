// hooks/usePatients.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { User } from '@/features/dashboard/types/caregiver/user';
import { AxiosError } from 'axios';

const fetchPatients = async (userId: number): Promise<User[]> => {

    const response = await axiosInstance.get<User[]>(`/user/${userId}`);

  if (response.status !== 200) {
    throw new Error('Failed to fetch patients');
  }

  return response.data;
};

export const useGetPatientProfile = (userId: number) => {
  return useQuery<User[], AxiosError>({
    queryKey: ['user-profiles', userId], 
    queryFn: () => fetchPatients(userId),
    staleTime: 1000 * 60 * 10,
  });
};
