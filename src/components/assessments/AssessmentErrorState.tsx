
import React from 'react';

const AssessmentErrorState: React.FC = () => {
  return (
    <div className="p-6 text-center text-rose-500">
      <p>Error loading assessments</p>
      <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
    </div>
  );
};

export default AssessmentErrorState;
