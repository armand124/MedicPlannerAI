import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { QuestionnaireSpec } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useQuestionnaire = () => {
  const [spec, setSpec] = useState<QuestionnaireSpec | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSpec = useCallback(async (specialization: string) => {
    setIsLoading(true);
    try {
      // expects backend endpoint: GET /questionnaire?specialization=<name>
      const response = await api.get<QuestionnaireSpec>(`/questionnaire?specialization=${encodeURIComponent(specialization)}`);
      setSpec(response);
    } catch (error) {
      console.error('Failed to fetch questionnaire:', error);
      toast({
        title: 'Error',
        description: 'Failed to load questionnaire. Please try again.',
        variant: 'destructive',
      });
      setSpec(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { spec, isLoading, fetchSpec };
};
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
