// MongoDB-compatible types for the medical planner

export type UserRole = 'patient' | 'doctor';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: Date;
  address?: string;
  medicalHistory?: string[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
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
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Questionnaire types for specialization-driven dynamic forms
export interface QuestionnaireQuestion {
  questionId: number;
  question: string;
  hasOptions: boolean;
  options?: string[];
  value?: string; // type hint (e.g., "number"), we keep answer separately
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
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
