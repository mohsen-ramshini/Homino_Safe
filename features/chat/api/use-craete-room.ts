import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';

export interface CreateRoomPayload {
  target_username: string;
  room_name: string;
  topic: string;
}

export interface CreateRoomResponse {
  room_id: string;
  // می‌توانی هر فیلد دیگری که backend برمی‌گرداند اضافه کنی
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateRoomResponse, AxiosError, CreateRoomPayload>({
    mutationFn: async (payload) => {
      const matrix_access_token = Cookies.get('synapse_access_token');

      if (!matrix_access_token) {
        throw new Error('No access token found');
      }
      try {
        const response = await axiosInstance.post<CreateRoomResponse>(
          '/synapse/direct-by-username',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Synapse-Authorization': `Bearer ${matrix_access_token}`,
            },
          }
        );
        // برمی‌گرداند داده واقعی بدون نیاز به بررسی دستی status
        return response.data;
      } catch (error: any) {
        // مدیریت دقیق خطاهای axios
        if (error.response) {
          console.error(
            'Create room failed',
            'Status:',
            error.response.status,
            'Data:',
            error.response.data
          );
        } else {
          console.error('Create room failed:', error.message);
        }
        throw error; // مجدداً throw می‌کنیم تا react-query متوجه شود
      }
    },

    onSuccess: (data) => {
      console.log('Room created successfully:', data);
      // queryClient.invalidateQueries(['rooms']); // اگر نیاز داری لیست اتاق‌ها آپدیت شود
    },

    onError: (error: AxiosError) => {
      console.error('Mutation onError:', error.message);
    },
  });
};
