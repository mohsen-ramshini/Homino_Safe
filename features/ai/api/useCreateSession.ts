import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
// import { toast } from 'sonner'; // در صورت نیاز فعال کن

export type SessionResponse = {
  session_id: string;
  status: string;
}

// تابع POST بدون body
const createSession = async (): Promise<SessionResponse> => {
  const response = await axiosInstance.post<SessionResponse>('/api/v1/chatbot/sessions');

  if (response.status !== 201) {
    throw new Error('Failed to create session');
  }

  return response.data;
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation<SessionResponse, AxiosError, void>({
    mutationFn: createSession,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      // toast.success('جلسه با موفقیت ایجاد شد!');
      console.log('Session created:', data);
    },

    onError: (error) => {
      // toast.error(error.message || 'خطا در ایجاد جلسه!');
      console.error('Create session error:', error);
    },
  });
};
