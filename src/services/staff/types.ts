
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
