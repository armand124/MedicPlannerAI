import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType, AuthResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { authApi, ApiError, apiRequest } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user and token on mount
    const initializeAuth = async () => {
      const token = localStorage.getItem('medical_planner_token');
      const storedUser = localStorage.getItem('medical_planner_user');
      
      if (token && storedUser) {
        try {
          // Verify token with server
          const user_data = await authApi.profile();
          const userData : User = {access_token: token, user_id: user_data.user_id, email: user_data.email, first_name: user_data.first_name, last_name: user_data.last_name, role: user_data.role };
          setUser(userData);
        } catch (error) {
          // Token is invalid or network error, clear stored data
          console.log("Errors on profile");
          localStorage.removeItem('medical_planner_token');
          localStorage.removeItem('medical_planner_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);

      // Store token and user data
      localStorage.setItem('medical_planner_token', data.access_token);
      localStorage.setItem('medical_planner_user', data.first_name); //JSON.stringify
      
      const user_data = await authApi.profile();
      const userData : User = {access_token: data.access_token, user_id: user_data.user_id, email: user_data.email, first_name: user_data.first_name, last_name: user_data.last_name, role: user_data.role };
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${localStorage.getItem('medical_planner_user')}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Invalid credentials';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, first_name: string, last_name: string, role: UserRole, specialization: string) => {
    setIsLoading(true);
    try {
      let data;
      if (role === 'doctor') {
        data = await authApi.register_medic(email, password, first_name, last_name, specialization);
      }
      else {
        data = await authApi.register_pacient(email, password, first_name, last_name);
      }
      console.log(data);
      

      // Store token and user data
      localStorage.setItem('medical_planner_token', data.access_token);
      localStorage.setItem('medical_planner_user', data.first_name); // JSON.stringify

      const user_data = await authApi.profile();
      const userData : User = {access_token: data.access_token, user_id: user_data.user_id, email: user_data.email, first_name: user_data.first_name, last_name: user_data.last_name, role: user_data.role };
      setUser(userData);
      
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to create account';
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('medical_planner_token');
    localStorage.removeItem('medical_planner_user');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
