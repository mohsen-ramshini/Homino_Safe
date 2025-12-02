import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';

export interface Room {
  room_id: string;
  name: string;
  member_count: number;
  canonical_alias: string;
}

export interface GetRoomsResponse {
  rooms: Room[];
}

export const useGetRooms = () => {
  const queryClient = useQueryClient();

  const fetchRooms = async (): Promise<GetRoomsResponse> => {
    const matrix_access_token = Cookies.get('synapse_access_token');

    if (!matrix_access_token) {
      throw new Error('No access token found');
    }

    try {
      const response = await axiosInstance.get<GetRoomsResponse>('/synapse/rooms', {
        headers: {
          'Content-Type': 'application/json',
          'Synapse-Authorization': `Bearer ${matrix_access_token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error(
          'Fetching rooms failed',
          'Status:',
          error.response.status,
          'Data:',
          error.response.data
        );
      } else {
        console.error('Fetching rooms failed:', error.message);
      }
      throw error;
    }
  };

  const query = useQuery<GetRoomsResponse, AxiosError>({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    // v5 اجازه onSuccess/onError مستقیم را نمی‌دهد
    // side-effectها را باید با useEffect یا در کامپوننت مدیریت کنید
  });

  // مدیریت side-effect داخل هوک
  useEffect(() => {
    if (query.data) {
      console.log('Rooms fetched successfully:', query.data);

      // اگر نیاز است، می‌توانید بعد از fetch، query دیگری را invalidate کنید
      // queryClient.invalidateQueries(['someOtherQuery']);
    }

    if (query.error) {
      console.error('useGetRooms onError:', query.error.message);
    }
  }, [query.data, query.error, queryClient]);

  return query;
};
