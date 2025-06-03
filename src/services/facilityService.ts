import { AxiosResponse } from 'axios';
import React from 'react';
import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import api from '@/services/api';

// Define the facility interface
export interface Facility {
  id: number;
  name: string;
  facility_type?: string;
  type?: string;
  address: string;
  city?: string;
  district: string;
  province: string;
  country: string;
  postal_code?: string;
  coordinates?: string;
  capacity?: number;
  status: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  established_date?: string;
  last_inspection_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  location?: string;
  latest_audit?: {
    status: 'scheduled' | 'completed' | 'missed';
    scheduled_date?: string;
    overall_score?: number;
  };
}

interface ApiResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

interface AuditResponse {
  id: string;
  status: 'scheduled' | 'completed' | 'missed';
  scheduled_date: string;
  audit_date: string;
  overall_score: number;
}

// Function to fetch all facilities
export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const apiResponse = await api.get<ApiResponse<Facility>>('/api/facilities/');
    
    // Fetch latest audits for each facility
    const facilitiesWithAudits = await Promise.all(
      apiResponse.results.map(async (facility) => {
        try {
          const audits = await api.get<AuditResponse[]>(`/api/facilities/${facility.id}/audits/`);
          
          if (audits && audits.length > 0) {
            // Sort audits by date to get the most recent
            const sortedAudits = audits.sort((a, b) => 
              new Date(b.audit_date || b.scheduled_date).getTime() - 
              new Date(a.audit_date || a.scheduled_date).getTime()
            );
            
            const latestAudit = sortedAudits[0];
            return {
              ...facility,
              latest_audit: {
                status: latestAudit.status,
                scheduled_date: latestAudit.scheduled_date,
                overall_score: latestAudit.overall_score
              }
            };
          }
          return facility;
        } catch (error) {
          console.error(`Error fetching audits for facility ${facility.id}:`, error);
          return facility;
        }
      })
    );

    return facilitiesWithAudits;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

// Function to fetch a single facility
export const getFacility = async (id: number): Promise<Facility> => {
  try {
    const facility = await api.get<Facility>(`/api/facilities/${id}/`);
    
    try {
      const audits = await api.get<AuditResponse[]>(`/api/facilities/${id}/audits/`);
      
      if (audits && audits.length > 0) {
        // Sort audits by date to get the most recent
        const sortedAudits = audits.sort((a, b) => 
          new Date(b.audit_date || b.scheduled_date).getTime() - 
          new Date(a.audit_date || a.scheduled_date).getTime()
        );
        
        const latestAudit = sortedAudits[0];
        return {
          ...facility,
          latest_audit: {
            status: latestAudit.status,
            scheduled_date: latestAudit.scheduled_date,
            overall_score: latestAudit.overall_score
          }
        };
      }
    } catch (error) {
      console.error(`Error fetching audits for facility ${id}:`, error);
    }
    
    return facility;
  } catch (error) {
    throw error;
  }
};

// Function to create a new facility
export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    // Ensure required fields are present
    if (!facilityData.name || !facilityData.facility_type || !facilityData.address) {
      throw new Error('Missing required fields: name, facility_type, or address');
    }

    // Set default values for required fields if not provided
    const payload = {
      ...facilityData,
      status: facilityData.status || 'Active',
      country: facilityData.country || 'Rwanda',
      capacity: facilityData.capacity || 0
    };

    const { data: facility } = await api.post<AxiosResponse<Facility>>('/api/facilities/', payload);
    return facility;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

// Function to update a facility
export const updateFacility = async (id: number, facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const { data: facility } = await api.put<AxiosResponse<Facility>>(`/api/facilities/${id}/`, facilityData);
    return facility;
  } catch (error) {
    console.error(`Error updating facility with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a facility
export const deleteFacility = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/facilities/${id}/`);
  } catch (error) {
    console.error(`Error deleting facility with ID ${id}:`, error);
    throw error;
  }
};

// React Query hooks with proper typing
export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: getFacilities
  });
};

export const useFacility = (id: number) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: () => getFacility(id),
    enabled: !!id
  });
};

// Add mutations for CRUD operations
export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Facility>) => createFacility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Facility> }) => updateFacility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });
};
