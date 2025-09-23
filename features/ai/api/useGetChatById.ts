// hooks/useHistory.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Message } from '@/features/ai/types/chat';
import { AxiosError } from 'axios';

interface ChatParams {
  chatId: string;
}

// 👇 مسیر جدید درخواست اینجاست
const fetchChatById = async ({ chatId }: ChatParams): Promise<Message> => {
  const response = await axiosInstance.get<Message>(
    `/api/v1/chatbot/sessions/${chatId}/history`
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch history data');
  }

  return response.data;
};

export type UseMessageResult = UseQueryResult<Message, AxiosError>;

export const GetChatById = (chatId: string): UseMessageResult => {
  return useQuery<Message, AxiosError>({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChatById({ chatId }),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  });
};
