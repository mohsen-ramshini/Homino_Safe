import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosInstance from "@/api/axiosInstance";
import { AxiosError } from "axios";

export interface InvitationResponse {
  success: boolean;
  room_id: string;
  message?: string;
}

export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<InvitationResponse, AxiosError, string>({
    // payload = room_id
    mutationFn: async (room_id) => {
      const token = Cookies.get("synapse_access_token");
      if (!token) throw new Error("No access token found");

      try {
        const response = await axiosInstance.post<InvitationResponse>(
          `/synapse/invitations/${room_id}/reject`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "Synapse-Authorization": `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error: any) {
        if (error.response) {
          console.error(
            "Reject invitation failed",
            "Status:", error.response.status,
            "Data:", error.response.data
          );
        } else {
          console.error("Reject invitation failed:", error.message);
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      console.log("Invitation rejected:", data);
      // queryClient.invalidateQueries(["rooms"]);
    },

    onError: (error) => {
      console.error("Reject invitation error:", error.message);
    },
  });
};
