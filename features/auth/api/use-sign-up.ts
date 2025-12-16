import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import { SignupResponse } from '../types/auth'; 
import { PatientFormValues } from "../components/register/steps/PatientInfoStep"
// import { toast } from 'sonner';

export const useSignup = () => {
  return useMutation<SignupResponse, AxiosError, PatientFormValues>({
    mutationFn: async (data) => {
      console.log("📤 Sending signup data as JSON:", data);

      const response = await axiosInstance.post<SignupResponse>(
        '/register',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
  });
};


