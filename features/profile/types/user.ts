export type User = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  id: number;
  role: "admin" | "patient" | "caregiver";
  status: "active" | "inactive";
} | null;

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}