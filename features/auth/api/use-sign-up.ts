import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import { SignUpFormValues, SignupResponse } from '../types/auth'; 
// import { toast } from 'sonner';

export const useSignup = () => {
  return useMutation<SignupResponse, AxiosError, SignUpFormValues & { assigned_patients: number[] }>({
    mutationFn: async (data) => {
      console.log("📤 Sending signup data as JSON:", data);

      const response = await axiosInstance.post<SignupResponse>(
        '/register/caregiver',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Signup failed');
      }

      return response.data;
    },

    onSuccess: (data) => {
      if (data.access && data.refresh) {
        document.cookie = `access_token=${data.access}; path=/`;
        document.cookie = `refresh_token=${data.refresh}; path=/`;
      }
      window.location.href = '/auth/sign-in';
    },

    onError: (error) => {
      console.error('❌ Signup error:', error.response?.data || error);
    },
  });
};


