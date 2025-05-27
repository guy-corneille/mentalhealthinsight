import { useToast } from '@/hooks/use-toast';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface CriteriaFormData {
  name: string;
  category: string;
  description: string;
  guidance?: string;
  weight: number;
  indicators: Indicator[];
  type: 'assessment' | 'audit';
  standard?: string;
}

type ToastFunction = ReturnType<typeof useToast>['toast'];

export const validateCriteria = (
  criteria: CriteriaFormData,
  showToast: ToastFunction
): boolean => {
  if (!criteria.name || !criteria.description || !criteria.type || !criteria.category || criteria.weight <= 0 || criteria.weight > 100) {
    showToast({
      variant: "destructive",
      title: "Validation error",
      description: "Please fill all required fields and ensure the weight is between 0 and 100."
    });
    return false;
  }
  
  for (const indicator of criteria.indicators) {
    if (!indicator.name || indicator.weight <= 0 || indicator.weight > 100) {
      showToast({
        variant: "destructive",
        title: "Validation error",
        description: "All indicators must have a name and a weight between 0 and 100."
      });
      return false;
    }
  }
  return true;
};
