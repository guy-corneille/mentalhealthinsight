
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import staffApiService from './staffApiService';
import { StaffMember } from './types';

/**
 * React Query hooks for staff operations
 */

// Hook for fetching all staff
export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: staffApiService.getAllStaff,
  });
};

// Hook for fetching staff by facility
export const useStaffByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: ['staff', 'facility', facilityId],
    queryFn: () => staffApiService.getStaffByFacility(facilityId),
    enabled: !!facilityId, // Only run query if facilityId is provided
  });
};

// Hook for fetching a single staff member
export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffApiService.getStaffById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a staff member
export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: Partial<StaffMember>) => 
      staffApiService.createStaffMember(staffData),
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
      staffApiService.updateStaffMember(id, staffData),
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
    mutationFn: (id: string) => staffApiService.deleteStaffMember(id),
    onSuccess: () => {
      // Invalidate staff query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
