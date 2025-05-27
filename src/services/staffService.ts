// Re-export all staff-related functionality from one file
import staffApiService from './staff/staffApiService';
import { 
  useStaff, 
  useStaffByFacility, 
  useStaffMember, 
  useCreateStaffMember, 
  useUpdateStaffMember, 
  useDeleteStaffMember 
} from './staff/staffQueryHooks';
import { StaffMember, StaffQualification, StaffMemberDisplay } from './staff/types';

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
