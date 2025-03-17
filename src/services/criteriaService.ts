
import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define interfaces for assessment criteria data
export interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

export interface AssessmentCriteria {
  id: number;
  name: string;
  category: string;
  description: string;
  purpose?: 'Assessment' | 'Audit';
  indicators?: Indicator[];
  created_at?: string;
  updated_at?: string;
}

// Define API response for paginated data
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Criteria Service
 * Handles all API operations related to assessment criteria
 */
const criteriaService = {
  /**
   * Get all assessment criteria
   * @param type Criteria type (assessment or audit)
   * @returns Promise with criteria data
   */
  getAllCriteria: async (type: 'assessment' | 'audit'): Promise<AssessmentCriteria[]> => {
    console.log(`Fetching all ${type} criteria from API`);
    const purpose = type === 'assessment' ? 'Assessment' : 'Audit';
    const response = await api.get<PaginatedResponse<AssessmentCriteria>>(`/assessment-criteria/?purpose=${purpose}`);
    
    return Array.isArray(response.results) ? response.results : [];
  },

  /**
   * Get a single criterion by ID
   * @param id Criterion ID
   * @returns Promise with criterion data
   */
  getCriterionById: async (id: number): Promise<AssessmentCriteria> => {
    console.log(`Fetching criterion with ID ${id} from API`);
    const response = await api.get<AssessmentCriteria>(`/assessment-criteria/${id}/`);
    
    return response;
  },

  /**
   * Create a new criterion
   * @param criterionData Criterion data to create
   * @returns Promise with created criterion
   */
  createCriterion: async (criterionData: Partial<AssessmentCriteria>): Promise<AssessmentCriteria> => {
    console.log('Creating new criterion via API', criterionData);
    const response = await api.post<AssessmentCriteria>('/assessment-criteria/', criterionData);
    
    return response;
  },

  /**
   * Update an existing criterion
   * @param id Criterion ID
   * @param criterionData Updated criterion data
   * @returns Promise with updated criterion
   */
  updateCriterion: async (id: number, criterionData: Partial<AssessmentCriteria>): Promise<AssessmentCriteria> => {
    console.log(`Updating criterion with ID ${id} via API`, criterionData);
    const response = await api.put<AssessmentCriteria>(`/assessment-criteria/${id}/`, criterionData);
    
    return response;
  },

  /**
   * Delete a criterion
   * @param id Criterion ID to delete
   */
  deleteCriterion: async (id: number): Promise<void> => {
    console.log(`Deleting criterion with ID ${id} via API`);
    await api.delete(`/assessment-criteria/${id}/`);
  },

  /**
   * Get indicators for a specific criterion
   * @param criterionId Criterion ID
   * @returns Promise with indicators data
   */
  getIndicators: async (criterionId: number): Promise<Indicator[]> => {
    console.log(`Fetching indicators for criterion ID ${criterionId} from API`);
    const response = await api.get<Indicator[]>(`/assessment-criteria/${criterionId}/indicators/`);
    
    return Array.isArray(response) ? response : [];
  },
};

/**
 * React Query hooks for criteria operations
 */

// Hook for fetching all criteria
export const useAssessmentCriteria = (type: 'assessment' | 'audit' = 'assessment') => {
  return useQuery({
    queryKey: ['criteria', type],
    queryFn: () => criteriaService.getAllCriteria(type),
  });
};

// Hook for fetching a single criterion
export const useAssessmentCriterion = (id: number, options = {}) => {
  return useQuery({
    queryKey: ['criterion', id],
    queryFn: () => criteriaService.getCriterionById(id),
    enabled: !!id, // Only run query if id is provided
    ...options
  });
};

// Hook for creating a criterion
export const useCreateAssessmentCriteria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (criterionData: Partial<AssessmentCriteria>) => 
      criteriaService.createCriterion(criterionData),
    onSuccess: () => {
      // Invalidate criteria queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
    },
  });
};

// Hook for updating a criterion
export const useUpdateAssessmentCriteria = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (criterionData: Partial<AssessmentCriteria>) => 
      criteriaService.updateCriterion(id, criterionData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
      queryClient.invalidateQueries({ queryKey: ['criterion', id] });
    },
  });
};

// Hook for deleting a criterion
export const useDeleteAssessmentCriteria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => criteriaService.deleteCriterion(id),
    onSuccess: () => {
      // Invalidate criteria queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
    },
  });
};

export default criteriaService;
