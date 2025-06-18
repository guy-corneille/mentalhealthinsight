import React from 'react';
import Layout from '@/components/layout/Layout';
import AssessmentStats from '@/components/assessments/AssessmentStats';
import { usePageAuth } from '@/hooks/usePageAuth';

const AssessmentTrends: React.FC = () => {
  // Protect at viewer level - all authenticated users can access
  usePageAuth('viewer');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of assessment statistics and trends
          </p>
        </div>
        
        <div className="animate-fade-in">
          <AssessmentStats />
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentTrends;
