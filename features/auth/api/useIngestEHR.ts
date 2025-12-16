// hooks/useIngestEHR.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';


export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  start_date: string;
}

export interface Symptom {
  name: string;
  notes?: string;
  onset_date: string;
  severity: string;
}

export interface Comorbidities {
  diabetes?: string;
  hypertension?: string;
  [key: string]: string | undefined;
}

export interface IngestEHRInput {
  user_id: number;
  comorbidities?: Comorbidities;
  diagnosis?: string;
  medications?: Medication[];
  physician_notes?: string;
  symptoms?: Symptom[];
}


export interface IngestEHRResponse {
  id: number;
  user_id: number;
  created_at: string;
}


const ingestEHR = async (data: IngestEHRInput): Promise<IngestEHRResponse> => {
  const response = await axiosInstance.post<IngestEHRResponse>('/api/ingest/ehr', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};


export const useIngestEHR = () => {
  const queryClient = useQueryClient();

  return useMutation<IngestEHRResponse, AxiosError, IngestEHRInput>({
    mutationFn: ingestEHR,
  });
};
