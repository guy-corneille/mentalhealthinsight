import api from '../api';
import { StaffMember, StaffQualification } from './types';

// Generate a unique staff ID with format S-XXXX
const generateStaffId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `S-${randomNum}`;
};

/**
 * Staff API Service
 * Handles all API operations related to staff members
 */
const staffApiService = {
  /**
   * Get all staff members
   * @returns Promise with staff data
   */
  getAllStaff: async (): Promise<StaffMember[]> => {
    console.log('Fetching all staff from API');
    try {
      const response = await api.get<any>('/api/staff/');
      
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
      const response = await api.get<any>(`/api/facilities/${facilityId}/staff/`);
      
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
      const response = await api.get<StaffMember>(`/api/staff/${id}/`);
      
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
      // Generate an ID if not provided
      const dataWithId = {
        ...staffData,
        id: staffData.id || generateStaffId(),
      };
      
      console.log('Sending staff data with ID:', dataWithId);
      const response = await api.post<StaffMember>('/api/staff/', dataWithId);
      
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
      const response = await api.put<StaffMember>(`/api/staff/${id}/`, staffData);
      
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
      await api.delete(`/api/staff/${id}/`);
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
      const response = await api.get<StaffQualification[]>(`/api/staff/${id}/qualifications/`);
      
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

export default staffApiService;
