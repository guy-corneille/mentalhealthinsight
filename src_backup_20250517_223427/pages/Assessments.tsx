
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AssessmentList from '@/components/assessments/AssessmentList';
import AssessmentEvaluation from '@/components/assessments/AssessmentEvaluation';

const Assessments: React.FC = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');

  const handleStartEvaluation = (patientId: string, facilityId: string) => {
    setSelectedPatientId(patientId);
    setSelectedFacilityId(facilityId);
    setIsEvaluating(true);
  };

  const handleCompleteEvaluation = () => {
    setIsEvaluating(false);
  };

  const handleCancelEvaluation = () => {
    setIsEvaluating(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create, view, and manage individual patient assessments and evaluation results.
          </p>
        </div>
        
        {isEvaluating ? (
          <AssessmentEvaluation 
            patientId={selectedPatientId}
            facilityId={selectedFacilityId}
            onComplete={handleCompleteEvaluation}
            onCancel={handleCancelEvaluation}
          />
        ) : (
          <div className="space-y-6">
            <AssessmentList onStartAssessment={handleStartEvaluation} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assessments;
