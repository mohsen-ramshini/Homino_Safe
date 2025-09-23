import { toast } from 'sonner';
import { useMutation } from 'react-query';

export function useUpdateProfileSettings() {
  const mutation = useMutation(
    (data) => fetch('/api/profile/settings', { method: 'POST', body: JSON.stringify(data) }),
    {
      onSuccess: () => {
        toast.success('Profile settings updated successfully');
      },
      onError: () => {
        toast.error('Failed to update profile settings');
      },
    }
  );
  return mutation;
}