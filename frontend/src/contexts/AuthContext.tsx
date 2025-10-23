import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('medical_planner_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual MongoDB API call
      // For now, simulate with localStorage
      const users = JSON.parse(localStorage.getItem('medical_planner_users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      setUser(foundUser);
      localStorage.setItem('medical_planner_user', JSON.stringify(foundUser));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
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
      // TODO: Replace with actual MongoDB API call
      const users = JSON.parse(localStorage.getItem('medical_planner_users') || '[]');
      
      if (users.find((u: User) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        _id: `user_${Date.now()}`,
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      localStorage.setItem('medical_planner_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('medical_planner_user', JSON.stringify(newUser));
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
