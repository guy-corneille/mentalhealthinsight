
import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for patient data
export interface Patient {
  id: number;
  patient_id: string; // The display ID (P-XXXX format)
  first_name: string;
  last_name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  diagnosis: string;
  facility: number; // Foreign key to facility
  facility_name?: string; // Added for frontend display
  admission_date: string;
  status: 'Active' | 'Discharged' | 'Transferred' | 'Inactive';
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

// Transform API patient data to frontend format
const transformPatient = (patient: any): Patient => {
  // Calculate age from date_of_birth
  const birthDate = patient.date_of_birth ? new Date(patient.date_of_birth) : null;
  const today = new Date();
  const age = birthDate 
    ? Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
    : 0;
    
  return {
    ...patient,
    age,
    patient_id: patient.id || '', // Use the ID from backend as patient_id
    diagnosis: patient.notes || 'Not specified', // Use notes as diagnosis temporarily
    admission_date: patient.registration_date || new Date().toISOString().split('T')[0],
  };
};

/**
 * Patient Service
 * Handles all API operations related to patients
 */
const patientService = {
  /**
   * Get all patients
   * @returns Promise with patient data
   */
  getAllPatients: async (): Promise<Patient[]> => {
    console.log('Fetching all patients from API');
    const response = await api.get<PaginatedResponse<any>>('/patients/');
    
    return Array.isArray(response.results) 
      ? response.results.map(transformPatient)
      : [];
  },
  
  /**
   * Get patients for a specific facility
   * @param facilityId The facility ID
   * @returns Promise with patient data
   */
  getPatientsByFacility: async (facilityId: number): Promise<Patient[]> => {
    console.log(`Fetching patients for facility ID ${facilityId} from API`);
    const response = await api.get<PaginatedResponse<any>>(`/patients/?facility=${facilityId}`);
    
    return Array.isArray(response.results) 
      ? response.results.map(transformPatient)
      : [];
  },

  /**
   * Get a single patient by ID
   * @param id Patient ID
   * @returns Promise with patient data
   */
  getPatientById: async (id: number): Promise<Patient> => {
    console.log(`Fetching patient with ID ${id} from API`);
    const response = await api.get<any>(`/patients/${id}/`);
    
    return transformPatient(response);
  },

  /**
   * Create a new patient
   * @param patientData Patient data to create
   * @returns Promise with created patient
   */
  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    console.log('Creating new patient via API', patientData);
    
    // Transform frontend data to backend format
    const backendData = {
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      date_of_birth: new Date(Date.now() - (patientData.age || 30) * 365.25 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0], // Calculate approx birth date from age
      gender: patientData.gender,
      facility: patientData.facility,
      status: patientData.status,
      registration_date: patientData.admission_date,
      notes: patientData.diagnosis,
      address: '', // Required field
      phone: '',   // Required field
    };
    
    const response = await api.post<any>('/patients/', backendData);
    
    return transformPatient(response);
  },

  /**
   * Update an existing patient
   * @param id Patient ID
   * @param patientData Updated patient data
   * @returns Promise with updated patient
   */
  updatePatient: async (id: number, patientData: Partial<Patient>): Promise<Patient> => {
    console.log(`Updating patient with ID ${id} via API`, patientData);
    
    // Get current patient data to avoid overwriting fields
    const currentPatient = await patientService.getPatientById(id);
    
    // Transform frontend data to backend format
    const backendData = {
      first_name: patientData.first_name || currentPatient.first_name,
      last_name: patientData.last_name || currentPatient.last_name,
      gender: patientData.gender || currentPatient.gender,
      facility: patientData.facility || currentPatient.facility,
      status: patientData.status || currentPatient.status,
      registration_date: patientData.admission_date || currentPatient.admission_date,
      notes: patientData.diagnosis || currentPatient.diagnosis,
    };
    
    const response = await api.patch<any>(`/patients/${id}/`, backendData);
    
    return transformPatient(response);
  },

  /**
   * Delete a patient
   * @param id Patient ID to delete
   */
  deletePatient: async (id: number): Promise<void> => {
    console.log(`Deleting patient with ID ${id} via API`);
    await api.delete(`/patients/${id}/`);
  },
};

/**
 * React Query hooks for patient operations
 */

// Hook for fetching all patients
export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients
  });
};

// Hook for fetching patients by facility
export const usePatientsByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: ['patients', 'facility', facilityId],
    queryFn: () => patientService.getPatientsByFacility(facilityId),
    enabled: !!facilityId, // Only run query if facilityId is provided
  });
};

// Hook for fetching a single patient
export const usePatient = (id: number) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// Hook for creating a patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.createPatient(patientData),
    onSuccess: () => {
      // Invalidate patients queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Hook for updating a patient
export const useUpdatePatient = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<Patient>) => 
      patientService.updatePatient(id, patientData),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
};

// Hook for deleting a patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => patientService.deletePatient(id),
    onSuccess: () => {
      // Invalidate patients queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export default patientService;
