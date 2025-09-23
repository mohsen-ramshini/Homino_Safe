import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';
import { ProfileSettingsPayload } from '../../types/caregiver/thresholdsSchema ';

export const useUpdateProfileSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, ProfileSettingsPayload>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.put('/api/profile/settings', payload);
      if (response.status !== 200) {
        throw new Error('Failed to update profile settings');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile settings updated');
      queryClient.invalidateQueries({ queryKey: ['profileSettings'] });
    },
    onError: () => {
      toast.error('Failed to update profile settings');
    },
  });

  return mutation;
};
