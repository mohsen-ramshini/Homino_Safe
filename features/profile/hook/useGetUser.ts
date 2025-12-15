import { useQuery } from '@tanstack/react-query';
import axiosInstance from "@/api/axiosInstance";
import Cookies from "js-cookie";
import { User } from "../types/user"; 
import { toast } from 'sonner';

export const getUserProfile = async (): Promise<User> => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    throw new Error("No tokens available");
  }

  const response = await axiosInstance.get<User>("/api/profile/user/");
  return response.data;
};


export const useUserProfile = () => {

  // Define the fetcher function
  const fetcher = async () => {
    return await getUserProfile();
  };

  const { data, error, isLoading, ...rest } = useSWR('/api/user/profile', fetcher);

  if (error) {
    toast.error('Failed to load user profile');
  }

  return { data, error, isLoading, ...rest };
};
function useSWR(key: string, fetcher: () => Promise<any>) {
  const { data, error, isLoading, ...rest } = useQuery({
    queryKey: [key],
    queryFn: fetcher,
  });

  return { data, error, isLoading, ...rest };
}
