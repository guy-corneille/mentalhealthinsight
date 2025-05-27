import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentEvaluation from '@/components/assessments/AssessmentEvaluation';
import Layout from '@/components/layout/Layout';
import { usePatient } from '@/services/patientService';

const AssessmentEvaluationPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatient(patientId || '');

  if (!patientId) {
    return <div className="p-8 text-center text-red-500">No patient selected.</div>;
  }
  if (isLoading) {
    return <Layout><div className="p-8 text-center">Loading patient details...</div></Layout>;
  }
  if (error || !patient) {
    return <Layout><div className="p-8 text-center text-red-500">Failed to load patient details.</div></Layout>;
  }
  if (!patient.facility) {
    return <Layout><div className="p-8 text-center text-red-500">Patient does not have a facility assigned.</div></Layout>;
  }

  return (
    <Layout>
      <AssessmentEvaluation
        patientId={patientId}
        facilityId={String(patient.facility)}
        onComplete={() => navigate('/assessments')}
        onCancel={() => navigate('/assessments')}
      />
    </Layout>
  );
};

export default AssessmentEvaluationPage; 