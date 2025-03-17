
import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for staff data
export interface StaffMember {
  id: number;
  name: string;
  position: string;
  department: string;
  facility: number; // Foreign key to facility
  facility_name?: string; // Added for frontend display
  join_date: string;
  status: 'Active' | 'On Leave' | 'Former';
  qualifications?: string[];
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for frontend display with additional properties
export interface StaffMemberDisplay extends StaffMember {
  facilityId: number;
  facilityName: string;
  joinDate: string;
  contact: {
    email: string;
    phone: string;
  };
}

// Define API response for paginated data
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Transform API staff data to frontend format
const transformStaffMember = (staff: StaffMember): StaffMemberDisplay => {
  return {
    ...staff,
    // Map backend fields to frontend fields
    facilityId: staff.facility,
    facilityName: staff.facility_name || 'Unknown Facility',
    joinDate: staff.join_date,
    // Structure contact information
    contact: {
      email: staff.contact_email || '',
      phone: staff.contact_phone || '',
    },
    // Ensure qualifications is always an array
    qualifications: staff.qualifications || [],
  };
};

// Transform frontend data to API format
const transformToApiFormat = (staffData: Partial<StaffMemberDisplay>): Partial<StaffMember> => {
  const apiData: Partial<StaffMember> = {
    ...staffData,
    // Map frontend fields to backend fields
    facility: staffData.facilityId || staffData.facility,
    join_date: staffData.joinDate || staffData.join_date,
    contact_email: staffData.contact?.email || staffData.contact_email,
    contact_phone: staffData.contact?.phone || staffData.contact_phone,
  };
  
  // Remove frontend-specific properties
  delete (apiData as any).facilityId;
  delete (apiData as any).facilityName;
  delete (apiData as any).joinDate;
  delete (apiData as any).contact;
  
  return apiData;
};

/**
 * Staff Service
 * Handles all API operations related to staff members
 */
const staffService = {
  /**
   * Get all staff members
   * @returns Promise with staff data
   */
  getAllStaff: async (): Promise<StaffMemberDisplay[]> => {
    console.log('Fetching all staff from API');
    const response = await api.get<PaginatedResponse<StaffMember>>('/staff/');
    
    return Array.isArray(response.results) 
      ? response.results.map(transformStaffMember)
      : [];
  },
  
  /**
   * Get staff members for a specific facility
   * @param facilityId The facility ID
   * @returns Promise with staff data
   */
  getStaffByFacility: async (facilityId: number): Promise<StaffMemberDisplay[]> => {
    console.log(`Fetching staff for facility ID ${facilityId} from API`);
    const response = await api.get<PaginatedResponse<StaffMember>>(`/staff/?facility=${facilityId}`);
    
    return Array.isArray(response.results) 
      ? response.results.map(transformStaffMember)
      : [];
  },

  /**
   * Get a single staff member by ID
   * @param id Staff ID
   * @returns Promise with staff data
   */
  getStaffById: async (id: number): Promise<StaffMemberDisplay> => {
    console.log(`Fetching staff with ID ${id} from API`);
    const response = await api.get<StaffMember>(`/staff/${id}/`);
    
    return transformStaffMember(response);
  },

  /**
   * Create a new staff member
   * @param staffData Staff data to create
   * @returns Promise with created staff
   */
  createStaff: async (staffData: Partial<StaffMemberDisplay>): Promise<StaffMemberDisplay> => {
    console.log('Creating new staff via API', staffData);
    const apiData = transformToApiFormat(staffData);
    const response = await api.post<StaffMember>('/staff/', apiData);
    
    return transformStaffMember(response);
  },

  /**
   * Update an existing staff member
   * @param id Staff ID
   * @param staffData Updated staff data
   * @returns Promise with updated staff
   */
  updateStaff: async (id: number, staffData: Partial<StaffMemberDisplay>): Promise<StaffMemberDisplay> => {
    console.log(`Updating staff with ID ${id} via API`, staffData);
    const apiData = transformToApiFormat(staffData);
    const response = await api.put<StaffMember>(`/staff/${id}/`, apiData);
    
    return transformStaffMember(response);
  },

  /**
   * Delete a staff member
   * @param id Staff ID to delete
   */
  deleteStaff: async (id: number): Promise<void> => {
    console.log(`Deleting staff with ID ${id} via API`);
    await api.delete(`/staff/${id}/`);
  },
};

/**
 * React Query hooks for staff operations
 */

// Hook for fetching all staff
export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: staffService.getAllStaff
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
export const useStaffMember = (id: number) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: Partial<StaffMemberDisplay>) => 
      staffService.createStaff(staffData),
    onSuccess: () => {
      // Invalidate staff queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Hook for updating a staff member
export const useUpdateStaff = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: Partial<StaffMemberDisplay>) => 
      staffService.updateStaff(id, staffData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
    },
  });
};

// Hook for deleting a staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => staffService.deleteStaff(id),
    onSuccess: () => {
      // Invalidate staff queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export default staffService;
