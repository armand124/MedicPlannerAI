export type UserRole = 'patient' | 'doctor';

export interface User {
  access_token: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  _id: string;
  date: string;
  status: string;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialization: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, first_name: string, last_name: string, role: UserRole, specialization: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Questionnaire types for specialization-driven dynamic forms
export interface QuestionnaireQuestion {
  questionId: number;
  question: string;
  hasOptions: boolean;
  options: string[];
  value: string; // type hint (e.g., "number"), we keep answer separately
}

export interface QuestionnaireSpec {
  specialization: string;
  questions: QuestionnaireQuestion[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  specialization: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
