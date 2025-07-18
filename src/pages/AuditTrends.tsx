import React from 'react';
import Layout from '@/components/layout/Layout';
import AuditTrends from '@/components/assessments/audits/AuditTrends';
import { usePageAuth } from '@/hooks/usePageAuth';

const AuditTrendsPage: React.FC = () => {
  // Protect at viewer level - all authenticated users can access
  usePageAuth('viewer');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of audit statistics and trends
          </p>
        </div>
        
        <div className="animate-fade-in">
          <AuditTrends />
        </div>
      </div>
    </Layout>
  );
};

export default AuditTrendsPage;
