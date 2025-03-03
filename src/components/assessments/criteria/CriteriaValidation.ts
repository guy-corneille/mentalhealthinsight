
import { useToast } from '@/hooks/use-toast';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface CriteriaFormData {
  name: string;
  description: string;
  standard: string;
  weight: number;
  indicators: Indicator[];
}

export const validateCriteria = (
  criteria: CriteriaFormData,
  toast: ReturnType<typeof useToast>
): boolean => {
  if (!criteria.name || !criteria.description || criteria.weight <= 0 || criteria.weight > 100) {
    toast({
      variant: "destructive",
      title: "Validation error",
      description: "Please fill all fields and ensure the weight is between 0 and 100."
    });
    return false;
  }
  
  for (const indicator of criteria.indicators) {
    if (!indicator.name || indicator.weight <= 0 || indicator.weight > 100) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "All indicators must have a name and a weight between 0 and 100."
      });
      return false;
    }
  }
  return true;
};
