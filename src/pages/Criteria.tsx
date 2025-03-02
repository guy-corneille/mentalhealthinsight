
import React from 'react';
import Layout from '@/components/layout/Layout';
import CriteriaList from '@/components/assessments/CriteriaList';

const Criteria: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Criteria</h1>
          <p className="text-muted-foreground mt-1">
            Define and manage the criteria used for facility and patient evaluations.
          </p>
        </div>
        
        <CriteriaList />
      </div>
    </Layout>
  );
};

export default Criteria;
