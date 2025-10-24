import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface Doctor {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [specializations, setSpecializations] = useState<string[]>([]);

  const fetchDoctors = useCallback(async (specialization?: string) => {
    setIsLoading(true);
    try {
      const res = await api.get<{ doctors: Doctor[] }>('/doctors/' + specialization);
      console.log(res);
      setDoctors(res.doctors);
      // derive specializations from doctors list for now (until dedicated endpoint)
      const specs = Array.from(new Set(res.doctors.map(d => d.specialization).filter(Boolean)));
      setSpecializations(specs);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors. Please try again.',
        variant: 'destructive',
      });
      setDoctors([]);
      setSpecializations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    isLoading,
    setDoctors: fetchDoctors,
  };
};
