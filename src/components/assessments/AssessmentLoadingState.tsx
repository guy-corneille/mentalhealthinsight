
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const AssessmentLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner size="lg" />
      <span className="ml-2">Loading assessments...</span>
    </div>
  );
};

export default AssessmentLoadingState;
