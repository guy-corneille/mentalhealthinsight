
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
  score?: number; // Add score property for TypeScript
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
    if ('results' in response && Array.isArray(response.results)) {
      return response.results;
    } 
    if (Array.isArray(response)) {
      return response;
    }
    console.error('Unexpected response format from facilities API', response);
    return [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

// Function to fetch a single facility by ID
export const getFacility = async (id: number): Promise<Facility> => {
  try {
    const response = await api.get<Facility>(`/api/facilities/${id}/`);
    return response;
  } catch (error) {
    console.error(`Error fetching facility with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new facility
export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const response = await api.post<Facility>('/api/facilities/', facilityData);
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

// React Query hooks for facilities
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
  return useMutation({
    mutationFn: (data: Partial<Facility>) => createFacility(data),
  });
};

export const useUpdateFacility = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Facility> }) => 
      updateFacility(id, data),
  });
};

export const useDeleteFacility = () => {
  return useMutation({
    mutationFn: (id: number) => deleteFacility(id),
  });
};
