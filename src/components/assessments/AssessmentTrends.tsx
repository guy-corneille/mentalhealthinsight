
import React from 'react';
import AssessmentStats from './AssessmentStats';

const AssessmentTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assessment Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive view of assessment statistics and trends
          </p>
        </div>
      </div>
      
      <div className="animate-fade-in">
        <AssessmentStats />
      </div>
    </div>
  );
};

export default AssessmentTrends;
