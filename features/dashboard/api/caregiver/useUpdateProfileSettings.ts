import { toast } from 'sonner';

export function useUpdateProfileSettings() {
  const updateProfileSettings = async (data: any) => {
    try {
      await fetch('/api/profile/settings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Profile settings updated successfully');
    } catch {
      toast.error('Failed to update profile settings');
    }
  };

  return updateProfileSettings;
}
