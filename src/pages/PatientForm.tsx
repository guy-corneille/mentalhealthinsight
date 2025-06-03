import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PatientDetails from '@/components/patients/PatientDetails';
import { usePatient } from '@/services/patientService';
import { Spinner } from '@/components/ui/spinner';

interface PatientFormProps {
  isEdit?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading } = usePatient(id || '');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        {isLoading && isEdit ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Loading patient data...</p>
          </div>
        ) : (
          <PatientDetails 
            patient={isEdit ? patient : null} 
          />
        )}
      </div>
    </Layout>
  );
};

export default PatientForm; 