
import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for the facility data
export interface Facility {
  id: number;
  name: string;
  facility_type: string; // From backend field naming
  type?: string; // For frontend compatibility
  address: string;
  city?: string;
  district: string;
  province: string;
  country: string;
  coordinates?: string;
  capacity: number;
  status: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  established_date?: string;
  last_inspection_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // Frontend only properties
  location?: string;
  lastAudit?: string;
  score?: number;
}

// Define API response for paginated data
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper function to transform backend facility data to frontend format
export const transformFacility = (facility: Facility): Facility => {
  return {
    ...facility,
    // Map facility_type to type for frontend compatibility
    type: facility.facility_type,
    // Create a location string from address components
    location: `${facility.city || facility.district}, ${facility.province}, ${facility.country}`,
    // Use last_inspection_date as lastAudit if available
    lastAudit: facility.last_inspection_date || new Date().toISOString().split('T')[0],
    // Default score value (in a real app this would come from audit data)
    score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for demo
  };
};

/**
 * Facility Service
 * Handles all API operations related to facilities
 */
const facilityService = {
  /**
   * Get all facilities
   * @returns Promise with facility data
   */
  getAllFacilities: async (): Promise<Facility[]> => {
    console.log('Fetching all facilities from API');
    // API endpoint for getting all facilities
    const response = await api.get<PaginatedResponse<Facility>>('/facilities/');
    
    // Transform the data for frontend use
    return Array.isArray(response.results) 
      ? response.results.map(transformFacility)
      : [];
  },

  /**
   * Get a single facility by ID
   * @param id Facility ID
   * @returns Promise with facility data
   */
  getFacilityById: async (id: number): Promise<Facility> => {
    console.log(`Fetching facility with ID ${id} from API`);
    // API endpoint for getting a specific facility
    const response = await api.get<Facility>(`/facilities/${id}/`);
    
    // Transform the data for frontend use
    return transformFacility(response);
  },

  /**
   * Create a new facility
   * @param facilityData Facility data to create
   * @returns Promise with created facility
   */
  createFacility: async (facilityData: Partial<Facility>): Promise<Facility> => {
    console.log('Creating new facility via API', facilityData);
    // API endpoint for creating a facility
    const response = await api.post<Facility>('/facilities/', facilityData);
    
    return transformFacility(response);
  },

  /**
   * Update an existing facility
   * @param id Facility ID
   * @param facilityData Updated facility data
   * @returns Promise with updated facility
   */
  updateFacility: async (id: number, facilityData: Partial<Facility>): Promise<Facility> => {
    console.log(`Updating facility with ID ${id} via API`, facilityData);
    // API endpoint for updating a facility
    const response = await api.put<Facility>(`/facilities/${id}/`, facilityData);
    
    return transformFacility(response);
  },

  /**
   * Delete a facility
   * @param id Facility ID to delete
   * @returns Promise with deleted facility data
   */
  deleteFacility: async (id: number): Promise<void> => {
    console.log(`Deleting facility with ID ${id} via API`);
    // API endpoint for deleting a facility
    await api.delete(`/facilities/${id}/`);
  },
};

/**
 * React Query hooks for facility operations
 */

// Hook for fetching all facilities
export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: facilityService.getAllFacilities,
  });
};

// Hook for fetching a single facility
export const useFacility = (id: number) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: () => facilityService.getFacilityById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a facility
export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (facilityData: Partial<Facility>) => 
      facilityService.createFacility(facilityData),
    onSuccess: () => {
      // Invalidate facilities query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
};

// Hook for updating a facility
export const useUpdateFacility = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (facilityData: Partial<Facility>) => 
      facilityService.updateFacility(id, facilityData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility', id] });
    },
  });
};

// Hook for deleting a facility
export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => facilityService.deleteFacility(id),
    onSuccess: () => {
      // Invalidate facilities query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
};

export default facilityService;
