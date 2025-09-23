import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance'; 
import { AxiosError } from 'axios';
import { LogoutResponse } from '../types/auth';


export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, AxiosError>({
    mutationFn: async (): Promise<LogoutResponse> => {
      const accessToken = Cookies.get('access_token');

      if (!accessToken) {
        throw new Error('No refresh token found');
      }

      const response = await axiosInstance.post<LogoutResponse>(
        '/logout',
        { access_token: accessToken },
      );

      if (response.status !== 200) {
        throw new Error('Logout failed');
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.clear(); 
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.href = '/auth/sign-in'; 
    },

    onError: (error) => {
      console.error('Logout failed:', error.response?.data || error.message);
    },
  });
};
