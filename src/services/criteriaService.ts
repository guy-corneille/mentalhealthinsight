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
  purpose: 'Assessment' | 'Audit';
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
    
    // Use different endpoints for assessment and audit criteria
    const endpoint = type === 'assessment' 
      ? '/assessment-criteria/'
      : '/audit-criteria/';
      
    const response = await api.get<PaginatedResponse<AssessmentCriteria>>(`${endpoint}?purpose=${purpose}`);
    
    return Array.isArray(response.results) ? response.results : [];
  },

  /**
   * Get a single criterion by ID
   * @param id Criterion ID
   * @returns Promise with criterion data
   */
  getCriterionById: async (id: number): Promise<AssessmentCriteria> => {
    console.log(`Fetching criterion with ID ${id} from API`);
    // We'll determine endpoint based on purpose in the future
    // For now, use assessment-criteria endpoint
    const response = await api.get<AssessmentCriteria>(`/assessment-criteria/${id}/`);
    
    return response;
  },

  /**
   * Create a new criterion
   * @param criterionData Criterion data to create
   * @returns Promise with created criterion
   */
  createCriterion: async (criterionData: Partial<AssessmentCriteria>): Promise<AssessmentCriteria> => {
    console.log('Creating criterion with data:', criterionData);
    const endpoint = criterionData.purpose === 'Audit' 
      ? '/audit-criteria/' 
      : '/assessment-criteria/';
      
    // Create criterion with indicators in a single request
    const response = await api.post<AssessmentCriteria>(endpoint, {
      name: criterionData.name,
      category: criterionData.category,
      description: criterionData.description,
      purpose: criterionData.purpose,
      indicators: criterionData.indicators || []
    });
    
    return response;
  },

  /**
   * Update an existing criterion
   * @param id Criterion ID
   * @param criterionData Updated criterion data
   * @returns Promise with updated criterion
   */
  updateCriterion: async (id: number, criterionData: Partial<AssessmentCriteria>): Promise<AssessmentCriteria> => {
    console.log('Updating criterion with data:', criterionData);
    const endpoint = criterionData.purpose === 'Audit' 
      ? `/audit-criteria/${id}/` 
      : `/assessment-criteria/${id}/`;
      
    // Update criterion with indicators in a single request
    const response = await api.put<AssessmentCriteria>(endpoint, {
      name: criterionData.name,
      category: criterionData.category,
      description: criterionData.description,
      purpose: criterionData.purpose,
      indicators: criterionData.indicators || []
    });
    
    return response;
  },

  /**
   * Delete a criterion
   * @param id Criterion ID
   * @param purpose Whether it's an assessment or audit criterion
   */
  deleteCriterion: async (id: number, purpose: 'Assessment' | 'Audit'): Promise<void> => {
    console.log(`Deleting criterion with ID ${id} and purpose ${purpose} via API`);
    
    // Use different endpoints based on purpose
    const endpoint = purpose === 'Audit' 
      ? `/audit-criteria/${id}/` 
      : `/assessment-criteria/${id}/`;
      
    await api.delete(endpoint);
  },

  /**
   * Get indicators for a specific criterion
   * @param criterionId Criterion ID
   * @param purpose Whether it's an assessment or audit criterion
   * @returns Promise with indicators data
   */
  getIndicators: async (criterionId: number, purpose: 'Assessment' | 'Audit'): Promise<Indicator[]> => {
    console.log(`Fetching indicators for criterion ID ${criterionId} from API`);
    
    // Use different endpoints based on purpose
    const endpoint = purpose === 'Audit' 
      ? `/audit-criteria/${criterionId}/indicators/` 
      : `/assessment-criteria/${criterionId}/indicators/`;
      
    const response = await api.get<Indicator[]>(endpoint);
    
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
    onSuccess: (data) => {
      // Invalidate criteria queries to refetch the list
      const purpose = data.purpose || 'Assessment';
      const type = purpose === 'Assessment' ? 'assessment' : 'audit';
      queryClient.invalidateQueries({ queryKey: ['criteria', type] });
    },
  });
};

// Hook for updating a criterion
export const useUpdateAssessmentCriteria = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (criterionData: Partial<AssessmentCriteria>) => 
      criteriaService.updateCriterion(id, criterionData),
    onSuccess: (data) => {
      // Invalidate relevant queries
      const purpose = data.purpose || 'Assessment';
      const type = purpose === 'Assessment' ? 'assessment' : 'audit';
      queryClient.invalidateQueries({ queryKey: ['criteria', type] });
      queryClient.invalidateQueries({ queryKey: ['criterion', id] });
    },
  });
};

// Hook for deleting a criterion
export const useDeleteAssessmentCriteria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, purpose }: { id: number; purpose: 'Assessment' | 'Audit' }) => 
      criteriaService.deleteCriterion(id, purpose),
    onSuccess: (_, { purpose }) => {
      // Invalidate criteria queries to refetch the list
      const type = purpose === 'Assessment' ? 'assessment' : 'audit';
      queryClient.invalidateQueries({ queryKey: ['criteria', type] });
    },
  });
};

export default criteriaService;
