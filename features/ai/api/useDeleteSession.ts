import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';

const deleteSession = async (sessionId: string): Promise<void> => {
  console.log(`🟡 Sending DELETE request for sessionId: ${sessionId}`);

  const response = await axiosInstance.delete(`/api/v1/chatbot/sessions/${sessionId}`);

  console.log('🟢 DELETE response:', {
    status: response.status,
    data: response.data,
  });

  // قبول وضعیت 200 یا 204 به عنوان موفقیت
  if (response.status !== 204 && response.status !== 200) {
    console.error(`🔴 Unexpected status code: ${response.status}`);
    throw new Error('Failed to delete session');
  }
};


export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteSession,

    onSuccess: (_, sessionId) => {
      console.log(`✅ Session "${sessionId}" deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },

    onError: (error, sessionId) => {
      console.error(`❌ Error deleting session "${sessionId}":`, error.message);
      if (error.response) {
        console.error('❗ Error response from server:', error.response.data);
      }
    },
  });
};
