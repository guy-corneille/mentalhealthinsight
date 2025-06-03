import { useQuery } from '@tanstack/react-query';
import api from './api';

export interface FacilityStaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  facility: number;
  facility_name: string;
  join_date: string;
  status: string;
  email: string;
  phone: string;
  qualifications: Array<{
    id: number;
    qualification: string;
  }>;
}

export const useFacilityStaff = (facilityId: string | null) => {
  return useQuery({
    queryKey: ['facilityStaff', facilityId],
    queryFn: async () => {
      if (!facilityId) return [];
      const response = await api.get<FacilityStaffMember[]>(`/api/staff/?facility=${facilityId}`);
      return response || [];
    },
    enabled: !!facilityId,
  });
}; 