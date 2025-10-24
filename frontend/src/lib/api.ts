// API utility functions for making authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('medical_planner_token');
};

// Make authenticated API request
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:8080',
      // 'Access-Control-Allow-Credentials': 'true',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log(response);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
};

// Auth-specific API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register_medic: async (email: string, password: string, first_name: string, last_name: string, specialization: string) => {
    return apiRequest('/register-medic', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name, specialization}),
    });
  },

  register_pacient: async (email: string, password: string, first_name: string, last_name: string) => {
    return apiRequest('/register-pacient', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name}),
    });
  },

  profile: async () => {
    return apiRequest('/profile', {
      method: 'GET'
    });
  },

  logout: async () => {
    return apiRequest('/logout', {
      method: 'POST',
    });
  },
};

// Generic API functions for other endpoints
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint),
  
  post: <T = any>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T = any>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
};
