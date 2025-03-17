import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for the staff data
export interface StaffQualification {
  id?: number;
  qualification: string;
  staff?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  facility: number;
  facility_name?: string;
  join_date: string;
  status: string;
  email: string;
  phone: string;
  qualifications?: StaffQualification[];
  created_at?: string;
  updated_at?: string;
}

// An interface for display purposes with renamed fields to match the UI
export interface StaffMemberDisplay extends Omit<StaffMember, 'facility_name'> {
  facilityName: string;
}

/**
 * Staff Service
 * Handles all API operations related to staff members
 */
const staffService = {
  /**
   * Get all staff members
   * @returns Promise with staff data
   */
  getAllStaff: async (): Promise<StaffMember[]> => {
    console.log('Fetching all staff from API');
    try {
      const response = await api.get<any>('/staff/');
      
      console.log('API response for staff:', response);
      
      if (response && Array.isArray(response.results)) {
        return response.results;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      console.warn('Invalid API response for staff:', response);
      return [];
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  /**
   * Get staff members by facility
   * @param facilityId Facility ID
   * @returns Promise with staff data for a specific facility
   */
  getStaffByFacility: async (facilityId: number): Promise<StaffMember[]> => {
    console.log(`Fetching staff for facility ${facilityId} from API`);
    try {
      const response = await api.get<any>(`/facilities/${facilityId}/staff/`);
      
      console.log(`API response for facility ${facilityId} staff:`, response);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.results)) {
        return response.results;
      }
      
      console.warn(`Invalid API response for facility ${facilityId} staff:`, response);
      return [];
    } catch (error) {
      console.error(`Error fetching staff for facility ${facilityId}:`, error);
      throw error;
    }
  },

  /**
   * Get a single staff member by ID
   * @param id Staff ID
   * @returns Promise with staff member data
   */
  getStaffById: async (id: string): Promise<StaffMember> => {
    console.log(`Fetching staff member with ID ${id} from API`);
    try {
      const response = await api.get<StaffMember>(`/staff/${id}/`);
      
      console.log(`API response for staff ${id}:`, response);
      
      return response;
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new staff member
   * @param staffData Staff data to create
   * @returns Promise with created staff member
   */
  createStaffMember: async (staffData: Partial<StaffMember>): Promise<StaffMember> => {
    console.log('Creating new staff member via API', staffData);
    try {
      const response = await api.post<StaffMember>('/staff/', staffData);
      
      console.log('API response for create staff:', response);
      
      return response;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  },

  /**
   * Update an existing staff member
   * @param id Staff ID
   * @param staffData Updated staff data
   * @returns Promise with updated staff member
   */
  updateStaffMember: async (id: string, staffData: Partial<StaffMember>): Promise<StaffMember> => {
    console.log(`Updating staff member with ID ${id} via API`, staffData);
    try {
      const response = await api.put<StaffMember>(`/staff/${id}/`, staffData);
      
      console.log(`API response for update staff ${id}:`, response);
      
      return response;
    } catch (error) {
      console.error(`Error updating staff ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a staff member
   * @param id Staff ID to delete
   * @returns Promise with success message
   */
  deleteStaffMember: async (id: string): Promise<void> => {
    console.log(`Deleting staff member with ID ${id} via API`);
    try {
      await api.delete(`/staff/${id}/`);
      console.log(`Successfully deleted staff ${id}`);
    } catch (error) {
      console.error(`Error deleting staff ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get qualifications for a staff member
   * @param id Staff ID
   * @returns Promise with qualifications data
   */
  getStaffQualifications: async (id: string): Promise<StaffQualification[]> => {
    console.log(`Fetching qualifications for staff member ${id} from API`);
    try {
      const response = await api.get<StaffQualification[]>(`/staff/${id}/qualifications/`);
      
      console.log(`API response for staff ${id} qualifications:`, response);
      
      if (Array.isArray(response)) {
        return response;
      }
      
      console.warn(`Invalid API response for staff ${id} qualifications:`, response);
      return [];
    } catch (error) {
      console.error(`Error fetching qualifications for staff ${id}:`, error);
      throw error;
    }
  },
};

/**
 * React Query hooks for staff operations
 */

// Hook for fetching all staff
export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: staffService.getAllStaff,
  });
};

// Hook for fetching staff by facility
export const useStaffByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: ['staff', 'facility', facilityId],
    queryFn: () => staffService.getStaffByFacility(facilityId),
    enabled: !!facilityId, // Only run query if facilityId is provided
  });
};

// Hook for fetching a single staff member
export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a staff member
export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: Partial<StaffMember>) => 
      staffService.createStaffMember(staffData),
    onSuccess: () => {
      // Invalidate staff query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Hook for updating a staff member
export const useUpdateStaffMember = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: Partial<StaffMember>) => 
      staffService.updateStaffMember(id, staffData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
    },
  });
};

// Hook for deleting a staff member
export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaffMember(id),
    onSuccess: () => {
      // Invalidate staff query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export default staffService;
