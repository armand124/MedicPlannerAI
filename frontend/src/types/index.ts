export type UserRole = 'patient' | 'doctor';

export interface User {
  _id: string;
  email: string;
  fName: string;
  lName: string;
  role: UserRole;
  specialization: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
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
  fName: string;
  lName: string;
  role: UserRole;
  specialization: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  name: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
