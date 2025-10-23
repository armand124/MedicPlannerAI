import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { authApi, ApiError } from '@/lib/api';

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
          const userData = await authApi.verify();
          setUser(userData.user);
        } catch (error) {
          // Token is invalid or network error, clear stored data
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
      localStorage.setItem('medical_planner_token', data.token);
      localStorage.setItem('medical_planner_user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
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

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(email, password, name, role);

      // Store token and user data
      localStorage.setItem('medical_planner_token', data.token);
      localStorage.setItem('medical_planner_user', JSON.stringify(data.user));
      setUser(data.user);
      
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
    try {
      // Call logout endpoint to invalidate token on server
      await authApi.logout();
    } catch (error) {
      // Even if server logout fails, we should still clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      setUser(null);
      localStorage.removeItem('medical_planner_token');
      localStorage.removeItem('medical_planner_user');
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    }
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
