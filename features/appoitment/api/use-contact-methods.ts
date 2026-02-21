import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { ContactMethod } from "../types";

const fetchContactMethods = async (): Promise<ContactMethod[]> => {
  const response = await apiClient.get("/api/contact-methods");

  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const useContactMethods = () => {
  const query = useQuery<ContactMethod[], Error>({
    queryKey: ["contact-methods"],
    queryFn: fetchContactMethods,
  });

  return query;
};
