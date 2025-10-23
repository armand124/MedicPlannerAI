import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
<<<<<<< Updated upstream
import { QuestionnaireSpec } from '@/types';
=======
>>>>>>> Stashed changes
import { useToast } from '@/hooks/use-toast';

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [specializations, setSpecializations] = useState<string[]>([]);
<<<<<<< Updated upstream
  const [questionnaireSpec, setQuestionnaireSpec] = useState<QuestionnaireSpec | null>(null);
=======
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      
      try {
        const response = await api.get<{ doctors: Doctor[] }>('/doctors');
        setDoctors(response.doctors);
        // derive specializations from doctors list for now (until dedicated endpoint)
        const specs = Array.from(new Set(response.doctors.map(d => d.specialization).filter(Boolean)));
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
    };

    fetchDoctors();
  }, [toast]);

  return {
    doctors,
    isLoading,
    specializations,
<<<<<<< Updated upstream
    questionnaireSpec,
    setQuestionnaireSpec,
=======
>>>>>>> Stashed changes
  };
};
