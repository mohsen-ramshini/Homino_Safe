import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { Meeting, MeetingPayload } from "../types";

/* ========= GET by ID ========= */
const fetchMeetingById = async (id: number | null): Promise<Meeting> => {
  if (id == null) return {} as Meeting;
  try {
    const response = await apiClient.get(`/api/meetings/${id}`);
    return response.data?.data ?? ({} as Meeting);
  } catch (err) {
    throw err;
  }
};

/**
 * Hook to get a single meeting by ID
 * Uses caching to prevent unnecessary GET requests
 */
export const useMeeting = (id: number | null) => {
  return useQuery<Meeting, Error>({
    queryKey: ["meeting", id],
    queryFn: () => fetchMeetingById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60,
  });
};

/* ========= CREATE ========= */
const createMeeting = async (payload: MeetingPayload): Promise<Meeting> => {
  const response = await apiClient.post("/api/meetings", payload);
  return response.data?.data ?? ({} as Meeting);
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation<Meeting, Error, MeetingPayload>({
    mutationFn: createMeeting,
    onSuccess: (newMeeting) => {
      queryClient.setQueryData(["meeting", newMeeting.id], newMeeting);
    },
  });
};

/* ========= UPDATE ========= */
const updateMeeting = async ({
  id,
  payload,
}: {
  id: number;
  payload: MeetingPayload;
}): Promise<Meeting> => {
  const response = await apiClient.put(`/api/meetings/${id}`, payload);
  return response.data?.data ?? ({} as Meeting);
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation<Meeting, Error, { id: number; payload: MeetingPayload }>({
    mutationFn: updateMeeting,
    onSuccess: (updatedMeeting, { id }) => {
      queryClient.setQueryData(["meeting", id], updatedMeeting);
    },
  });
};
