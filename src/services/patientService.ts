import { getFacilities, useFacilities } from '@/services/facilityService';
import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

// Define types for the patient data
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone?: string;
  email?: string;
  national_id?: string;
  status: string;
  facility: number;
  facility_name?: string;
  primary_staff?: number;
  primary_staff_name?: string;
  registration_date: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Define API response for paginated data
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Define a type for response that could be either an array or paginated
type ApiResponse<T> = T[] | PaginatedResponse<T>;

// Generate a unique patient ID with format P-XXXX
const generatePatientId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `P-${randomNum}`;
};

/**
 * Patient Service
 * Handles all API operations related to patients
 */
const patientService = {
  /**
   * Get all patients
   * @param page Page number (1-based)
   * @param pageSize Number of items per page
   * @param searchQuery Optional search query
   * @param facilityId Optional facility ID filter
   * @returns Promise with patient data
   */
  getAllPatients: async (page = 1, pageSize = 10, searchQuery = '', facilityId?: number) => {
    const params = {
      page,
      page_size: pageSize,
      ...(searchQuery && { search: searchQuery.trim() }),
      ...(facilityId && { facility: facilityId })
    };

    try {
      const response = await api.get<PaginatedResponse<Patient>>('/patients/', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get patients by facility
   * @param facilityId Facility ID
   * @returns Promise with patients data for a specific facility
   */
  getPatientsByFacility: async (facilityId: number): Promise<Patient[]> => {
    try {
      const response = await api.get<ApiResponse<Patient>>(`/api/facilities/${facilityId}/patients/`);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'results' in response) {
        return (response as PaginatedResponse<Patient>).results;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single patient by ID
   * @param id Patient ID
   * @returns Promise with patient data
   */
  getPatientById: async (id: string): Promise<Patient> => {
    try {
      const response = await api.get<Patient>(`/api/patients/${id}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new patient
   * @param patientData Patient data to create
   * @returns Promise with created patient
   */
  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    try {
      const dataWithId = {
        ...patientData,
        id: patientData.id || generatePatientId(),
      };
      
      const response = await api.post<Patient>('/api/patients/', dataWithId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing patient
   * @param id Patient ID
   * @param patientData Updated patient data
   * @returns Promise with updated patient
   */
  updatePatient: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    try {
      const dataWithId = {
        ...patientData,
        id: id,
      };
      
      const response = await api.put<Patient>(`/api/patients/${id}/`, dataWithId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a patient
   * @param id Patient ID to delete
   * @returns Promise with success message
   */
  deletePatient: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/patients/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

// Hook for fetching all patients with pagination
export const usePatients = (page = 1, pageSize = 10, searchQuery = '', facilityId?: number) => {
  return useQuery({
    queryKey: ['patients', page, pageSize, searchQuery, facilityId],
    queryFn: () => patientService.getAllPatients(page, pageSize, searchQuery, facilityId),
    staleTime: 0,
    gcTime: 0,
  });
};

// Hook for fetching patients by facility
export const usePatientsByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: ['patients', 'facility', facilityId],
    queryFn: () => patientService.getPatientsByFacility(facilityId),
    enabled: !!facilityId,
  });
};

// Hook for fetching a single patient
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
  });
};

// Hook for creating a patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.createPatient(patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Hook for updating a patient
export const useUpdatePatient = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.updatePatient(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
};

// Hook for deleting a patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export default patientService;