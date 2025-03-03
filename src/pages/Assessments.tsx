
import React from 'react';
import Layout from '@/components/layout/Layout';
import AssessmentList from '@/components/assessments/AssessmentList';

const Assessments: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            View and manage patient assessments and evaluation results.
          </p>
        </div>
        
        <AssessmentList />
      </div>
    </Layout>
  );
};

export default Assessments;
