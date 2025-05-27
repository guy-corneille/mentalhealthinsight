
/**
 * Staff Services Module
 * 
 * This module exports all staff-related services and hooks.
 * It provides a single entry point for importing staff functionality.
 */

// Re-export all staff-related functionality from one file
import staffApiService from '@/services/staff/staffApiService';
import { 
  useStaff, 
  useStaffByFacility, 
  useStaffMember, 
  useCreateStaffMember, 
  useUpdateStaffMember, 
  useDeleteStaffMember 
} from '@/services/staff/staffQueryHooks';
import { StaffMember, StaffQualification, StaffMemberDisplay } from '@/services/staff/types';

// Export the API service
export default staffApiService;

// Export the hooks
export {
  useStaff,
  useStaffByFacility,
  useStaffMember,
  useCreateStaffMember,
  useUpdateStaffMember,
  useDeleteStaffMember
};

// Export the types
export type { StaffMember, StaffQualification, StaffMemberDisplay };
