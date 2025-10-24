import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface Question {
    questionId: number;
    question: string;
    hasOptions: boolean;
    options: string[];
    optionsValue: number[];
    type: string;
}

export interface Form {
  specialization: string;
  questions: Question[];
  form_name: string;
  model_eval_id: string;
}

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [specializations, setSpecializations] = useState<string[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      
      try {
        const response = await api.get<{ forms: Form[] }>('/forms');
        setForms(response.forms);
        // derive specializations from forms list for now (until dedicated endpoint)
        const specs = Array.from(new Set(response.forms.map(f => f.specialization).filter(Boolean)));
        setSpecializations(specs);
      } catch (error) {
        console.error('Failed to fetch forms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forms. Please try again.',
          variant: 'destructive',
        });
        setForms([]);
        setSpecializations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  return {
    forms,
    isLoading,
    specializations,
  };
};
