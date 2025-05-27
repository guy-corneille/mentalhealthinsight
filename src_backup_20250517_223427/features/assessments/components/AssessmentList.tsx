
import React from 'react';
import AssessmentListComponent from '@/components/assessments/AssessmentList';

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  // This is a wrapper component that uses the main AssessmentList component
  return <AssessmentListComponent onStartAssessment={onStartAssessment} />;
};

export default AssessmentList;
