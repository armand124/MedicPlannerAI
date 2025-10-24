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
    // added: mapped options (label/value) for convenient lookup in UI
    optionsMap?: { label: string; value: number | string | boolean }[];
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
        // augment questions so that each question with options has an optionsMap: [{label, value}]
        const augmented = response.forms.map(f => ({
          ...f,
          questions: f.questions.map(q => {
            if (q.hasOptions && Array.isArray(q.options) && Array.isArray(q.optionsValue) && q.options.length === q.optionsValue.length) {
              return {
                ...q,
                optionsMap: q.options.map((label, i) => ({ label, value: q.optionsValue[i] })),
              };
            }
            return q;
          }),
        }));
        setForms(augmented);
        // derive specializations from augmented forms list
        const specs = Array.from(new Set(augmented.map(f => f.specialization).filter(Boolean)));
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

// Helper: convert a selected value (option label or raw input) into the typed answer for a question.
// - If question.hasOptions is true, it returns the corresponding optionsValue (number) when the label matches.
// - Otherwise converts based on question.type: 'number' -> number, 'string' -> string, 'boolean' -> boolean.
// Returns null when conversion/mapping fails.
export const getAnswerValue = (question: Question, selected: string): number | string | boolean | null => {
  if (!question) return null;

  if (question.hasOptions) {
    // Prefer optionsMap if available
    if (Array.isArray(question.optionsMap) && question.optionsMap.length > 0) {
      const found = question.optionsMap.find(o => o.label === selected);
      if (found) return found.value;
      const foundCI = question.optionsMap.find(o => o.label.toLowerCase() === selected.toLowerCase());
      if (foundCI) return foundCI.value;
      return null;
    }

    // fallback: use options/optionsValue arrays
    if (Array.isArray(question.options) && Array.isArray(question.optionsValue)) {
      const idx = question.options.findIndex(opt => opt === selected);
      if (idx !== -1 && idx < question.optionsValue.length) {
        return question.optionsValue[idx];
      }
      const idxCI = question.options.findIndex(opt => opt.toLowerCase() === selected.toLowerCase());
      if (idxCI !== -1 && idxCI < question.optionsValue.length) {
        return question.optionsValue[idxCI];
      }
      return null;
    }

    return null;
  }

  // No options — convert by declared type
  if (question.type === 'number') {
    const n = Number(selected);
    return Number.isNaN(n) ? null : n;
  }

  if (question.type === 'boolean') {
    const s = String(selected).trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0') return false;
    return null;
  }

  // default to string
  return String(selected);
};

export default useForms;
