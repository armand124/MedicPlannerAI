import { useState, useEffect } from 'react';
import { DoctorAppointment, QuestionnaireSpec } from '@/types';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type CreateAppointmentPayload = Omit<DoctorAppointment, '_id' | 'createdAt' | 'updatedAt'> & {
  questionnaire?: QuestionnaireSpec | { specialization: string; questions: Array<{ questionId: number; value: string }> };
};

export const useAppointments = (userId?: string, role?: 'patient' | 'doctor') => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId || !role) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        console.log(localStorage.getItem('medical_planner_token'));
        const response = await api.get<{ appointments: DoctorAppointment[] }>(`/appointments-doctor`);
        console.log(response.appointments);
        setAppointments(response.appointments);
        console.log(appointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointments. Please try again.',
          variant: 'destructive',
        });
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, role, toast]);

  const createAppointment = async (appointment: CreateAppointmentPayload) => {
    try {
      const response = await api.post<{ appointment: DoctorAppointment }>('/appointments', appointment);
      const newAppointment = response.appointment;
      
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<DoctorAppointment>) => {
    try {
      const response = await api.put<{ appointment: DoctorAppointment }>(`/appointments/${id}`, updates);
      const updatedAppointment = response.appointment;
      
      setAppointments(prev =>
        prev.map(apt => (apt._id === id ? updatedAppointment : apt))
      );
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
  };
};
