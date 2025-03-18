
import { useState, useEffect } from 'react';
import { usePatients, usePatient, useFacilities } from '@/services/patientService';

export interface PatientSelectionState {
  selectedPatientId: string;
  selectedFacilityId: string;
  patientComboOpen: boolean;
}

export const useNewAssessmentDialog = (
  onCreateAssessment: (patientId: string, facilityId: string) => void,
  onClose: () => void
) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [patientComboOpen, setPatientComboOpen] = useState(false);
  
  // Fetch patients and facilities
  const { data: patientsData, isLoading: isPatientsLoading } = usePatients();
  const { data: facilities, isLoading: isFacilitiesLoading } = useFacilities();
  const { data: selectedPatient } = usePatient(selectedPatientId);

  // Ensure patients is always an array even if data is undefined
  const patients = patientsData || [];
  
  // Auto-select facility when patient is selected
  useEffect(() => {
    if (selectedPatient && selectedPatient.facility) {
      setSelectedFacilityId(selectedPatient.facility.toString());
    }
  }, [selectedPatient]);

  const handleStartAssessment = () => {
    if (selectedPatientId && selectedFacilityId) {
      onCreateAssessment(selectedPatientId, selectedFacilityId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPatientId('');
    setSelectedFacilityId('');
    onClose();
  };

  // Get facility name for display
  const getFacilityName = (facilityId: string) => {
    const facility = facilities?.find(f => f.id.toString() === facilityId);
    return facility ? facility.name : '';
  };

  const isLoading = isPatientsLoading || isFacilitiesLoading;

  return {
    state: {
      selectedPatientId,
      selectedFacilityId,
      patientComboOpen,
    },
    data: {
      patients,
      facilities,
      isLoading,
    },
    actions: {
      setSelectedPatientId,
      setPatientComboOpen,
      handleStartAssessment,
      handleClose,
      getFacilityName,
    }
  };
};
