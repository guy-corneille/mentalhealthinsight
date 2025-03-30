
/**
 * Patient Service
 * 
 * This service handles all API operations related to patients.
 * It provides CRUD operations and React Query hooks for patient management.
 */
import api from '@/core/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for the patient data
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone?: string;
  email?: string;
  national_id?: string;
  status: string;
  facility: number;
  facility_name?: string;
  registration_date: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
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

// Define a type for response that could be either an array or paginated
type ApiResponse<T> = T[] | PaginatedResponse<T>;

/**
 * Generate a unique patient ID with format P-XXXX
 * Used when creating new patients to ensure unique IDs
 */
const generatePatientId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `P-${randomNum}`;
};

/**
 * Patient Service
 * Handles all API operations related to patients
 */
const patientService = {
  /**
   * Get all patients
   * @returns Promise with patient data
   */
  getAllPatients: async () => {
    console.log('Fetching all patients from API');
    try {
      const response = await api.get<ApiResponse<Patient>>('/patients/');
      
      console.log('API response for patients:', response);
      
      // Handle different response formats with proper type checking
      if (Array.isArray(response)) {
        return response as Patient[];
      } else if (response && typeof response === 'object' && 'results' in response) {
        return (response as PaginatedResponse<Patient>).results;
      }
      
      console.warn('Invalid API response format for patients:', response);
      return [] as Patient[];
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  /**
   * Get patients by facility
   * @param facilityId Facility ID
   * @returns Promise with patients data for a specific facility
   */
  getPatientsByFacility: async (facilityId: number): Promise<Patient[]> => {
    console.log(`Fetching patients for facility ${facilityId} from API`);
    try {
      const response = await api.get<ApiResponse<Patient>>(`/facilities/${facilityId}/patients/`);
      
      console.log(`API response for facility ${facilityId} patients:`, response);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'results' in response) {
        return (response as PaginatedResponse<Patient>).results;
      }
      
      console.warn(`Invalid API response for facility ${facilityId} patients:`, response);
      return [];
    } catch (error) {
      console.error(`Error fetching patients for facility ${facilityId}:`, error);
      throw error;
    }
  },

  /**
   * Get a single patient by ID
   * @param id Patient ID
   * @returns Promise with patient data
   */
  getPatientById: async (id: string): Promise<Patient> => {
    console.log(`Fetching patient with ID ${id} from API`);
    try {
      const response = await api.get<Patient>(`/patients/${id}/`);
      
      console.log(`API response for patient ${id}:`, response);
      
      return response;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new patient
   * @param patientData Patient data to create
   * @returns Promise with created patient
   */
  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    console.log('Creating new patient via API', patientData);
    try {
      // Generate a patient ID if not provided
      const dataWithId = {
        ...patientData,
        id: patientData.id || generatePatientId(),
      };
      
      console.log('Sending patient data with ID:', dataWithId);
      const response = await api.post<Patient>('/patients/', dataWithId);
      
      console.log('API response for create patient:', response);
      
      return response;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  /**
   * Update an existing patient
   * @param id Patient ID
   * @param patientData Updated patient data
   * @returns Promise with updated patient
   */
  updatePatient: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    console.log(`Updating patient with ID ${id} via API`, patientData);
    try {
      // Always include the ID in the request body
      const dataWithId = {
        ...patientData,
        id: id,
      };
      
      console.log(`Sending updated patient data with ID:`, dataWithId);
      const response = await api.put<Patient>(`/patients/${id}/`, dataWithId);
      
      console.log(`API response for update patient ${id}:`, response);
      
      return response;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a patient
   * @param id Patient ID to delete
   * @returns Promise with success message
   */
  deletePatient: async (id: string): Promise<void> => {
    console.log(`Deleting patient with ID ${id} via API`);
    try {
      await api.delete(`/patients/${id}/`);
      console.log(`Successfully deleted patient ${id}`);
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  },
};

/**
 * React Query hooks for patient operations
 */

// Hook for fetching all patients
export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients,
  });
};

// Hook for fetching patients by facility
export const usePatientsByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: ['patients', 'facility', facilityId],
    queryFn: () => patientService.getPatientsByFacility(facilityId),
    enabled: !!facilityId, // Only run query if facilityId is provided
  });
};

// Hook for fetching a single patient
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.createPatient(patientData),
    onSuccess: () => {
      // Invalidate patients query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Hook for updating a patient
export const useUpdatePatient = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.updatePatient(id, patientData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
};

// Hook for deleting a patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      // Invalidate patients query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Export facility hooks
export { useFacilities } from '@/services/facilityService';

export default patientService;
