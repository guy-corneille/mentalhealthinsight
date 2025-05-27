import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  lastAudit?: string;
  score?: number;
}

interface ApiResponse {
  results?: Facility[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Function to fetch all facilities
export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const response = await api.get<ApiResponse>('/api/facilities/');
    return Array.isArray(response.results) ? response.results : [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

// Function to fetch a single facility with audit data
export const getFacility = async (id: number): Promise<Facility> => {
  try {
    const facility = await api.get<Facility>(`/api/facilities/${id}/`);
    
    try {
      const auditsResponse = await api.get(`/api/facilities/${id}/audits/`);
      const audits = Array.isArray(auditsResponse) ? auditsResponse : [];
      
      if (audits.length > 0) {
        // Sort audits by date to get the most recent
        const sortedAudits = audits.sort((a, b) => 
          new Date(b.audit_date).getTime() - new Date(a.audit_date).getTime()
        );
        
        return {
          ...facility,
          score: sortedAudits[0].overall_score,
          lastAudit: sortedAudits[0].audit_date
        };
      }
    } catch (error) {
      console.error(`Error fetching audits for facility ${id}:`, error);
    }
    
    return facility;
  } catch (error) {
    console.error(`Error fetching facility with ID ${id}:`, error);
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

    const response = await api.post<Facility>('/api/facilities/', payload);
    return response;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

// Function to update an existing facility
export const updateFacility = async (id: number, facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const response = await api.put<Facility>(`/api/facilities/${id}/`, facilityData);
    return response;
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

// React Query hooks
export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: getFacilities
  });
};

export const useFacility = (id: number) => {
  const [data, setData] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFacility = async () => {
      setIsLoading(true);
      try {
        const facilityData = await getFacility(id);
        setData(facilityData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFacility();
    }
  }, [id]);

  return { data, isLoading, error };
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
    mutationFn: ({ id, data }: { id: number; data: Partial<Facility> }) => 
      updateFacility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });
};
