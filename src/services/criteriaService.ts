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
  guidance?: string;
  weight?: number;
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
      ? '/api/assessment-criteria/'
      : '/api/audit-criteria/';
      
    try {
      const response = await api.get<PaginatedResponse<AssessmentCriteria>>(endpoint);
      console.log(`Received ${type} criteria:`, response);
      return Array.isArray(response.results) ? response.results : [];
    } catch (error) {
      console.error(`Error fetching ${type} criteria:`, error);
      throw error;
    }
  },

  /**
   * Get a single criterion by ID
   * @param id Criterion ID
   * @param type The type of criterion (assessment or audit)
   * @returns Promise with criterion data
   */
  getCriterionById: async (id: number, type: 'assessment' | 'audit' = 'assessment'): Promise<AssessmentCriteria> => {
    console.log(`Fetching criterion with ID ${id} from API`);
    
    const endpoint = type === 'assessment'
      ? `/api/assessment-criteria/${id}/`
      : `/api/audit-criteria/${id}/`;
      
    try {
      const response = await api.get<AssessmentCriteria>(endpoint);
      console.log(`Received criterion details:`, response);
      return response;
    } catch (error) {
      console.error(`Error fetching criterion with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new criterion
   * @param criterionData Criterion data to create
   * @returns Promise with created criterion
   */
  createCriterion: async (criterionData: Partial<AssessmentCriteria>): Promise<AssessmentCriteria> => {
    console.log('Creating criterion with data:', criterionData);
    const endpoint = criterionData.purpose === 'Audit' 
      ? '/api/audit-criteria/' 
      : '/api/assessment-criteria/';
      
    try {
      // Create criterion with indicators in a single request
      const response = await api.post<AssessmentCriteria>(endpoint, criterionData);
      console.log('Created criterion:', response);
      return response;
    } catch (error) {
      console.error('Error creating criterion:', error);
      throw error;
    }
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
      ? `/api/audit-criteria/${id}/` 
      : `/api/assessment-criteria/${id}/`;
      
    try {
      // Update criterion with indicators in a single request
      const response = await api.put<AssessmentCriteria>(endpoint, criterionData);
      console.log('Updated criterion:', response);
      return response;
    } catch (error) {
      console.error(`Error updating criterion with ID ${id}:`, error);
      throw error;
    }
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
      ? `/api/audit-criteria/${id}/` 
      : `/api/assessment-criteria/${id}/`;
      
    try {
      await api.delete(endpoint);
      console.log(`Deleted criterion with ID ${id}`);
    } catch (error) {
      console.error(`Error deleting criterion with ID ${id}:`, error);
      throw error;
    }
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
      ? `/api/audit-criteria/${criterionId}/indicators/` 
      : `/api/assessment-criteria/${criterionId}/indicators/`;
      
    try {
      const response = await api.get<Indicator[]>(endpoint);
      console.log(`Received indicators:`, response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error(`Error fetching indicators for criterion ID ${criterionId}:`, error);
      throw error;
    }
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
  const location = window.location.pathname;
  const isAuditPath = location.includes('audit');
  const type = isAuditPath ? 'audit' : 'assessment';
  
  return useQuery({
    queryKey: ['criterion', id, type],
    queryFn: () => criteriaService.getCriterionById(id, type as 'assessment' | 'audit'),
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
