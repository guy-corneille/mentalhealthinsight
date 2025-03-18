
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface Assessment {
  id: number | string;
  patient: string;
  patient_name?: string;
  facility: string;
  facility_name?: string;
  assessment_date: string;
  score: number;
  notes: string;
  evaluator: string;
  evaluator_name?: string;
}

interface AssessmentApiResponse {
  results: Assessment[];
}

export const useAssessments = () => {
  return useQuery<AssessmentApiResponse>({
    queryKey: ['assessments'],
    queryFn: async () => {
      return await api.get<AssessmentApiResponse>('/assessments/');
    }
  });
};
