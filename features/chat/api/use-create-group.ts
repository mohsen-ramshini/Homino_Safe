import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';

export interface CreateGroupPayload {
  room_name: string;
  topic: string;
  invites: string[];
  is_public: boolean;
  room_alias: string;
}

export interface CreateGroupResponse {
  room_id: string;
  // اگر backend فیلدهای بیشتری برمی‌گرداند اینجا اضافه کن
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateGroupResponse, AxiosError, CreateGroupPayload>({
    mutationFn: async (payload) => {
      const matrix_access_token = Cookies.get('synapse_access_token');

      if (!matrix_access_token) {
        throw new Error('No access token found');
      }

      try {
        const response = await axiosInstance.post<CreateGroupResponse>(
          '/synapse/group',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Synapse-Authorization': `Bearer ${matrix_access_token}`,
            },
          }
        );

        return response.data;
      } catch (error: any) {
        if (error.response) {
          console.error(
            'Create group failed',
            'Status:',
            error.response.status,
            'Data:',
            error.response.data
          );
        } else {
          console.error('Create group failed:', error.message);
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      console.log('Group created successfully:', data);
      // queryClient.invalidateQueries(['groups']); // اگر لازم داری لیست گروه‌ها آپدیت شود
    },

    onError: (error: AxiosError) => {
      console.error('Mutation onError:', error.message);
    },
  });
};
