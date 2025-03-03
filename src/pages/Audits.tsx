
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuditsOverview from '@/components/audits/AuditsOverview';
import AuditsList from '@/components/audits/AuditsList';
import AuditsTrends from '@/components/audits/AuditsTrends';

const Audits: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facility Audits</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze audit results across all mental health facilities.
          </p>
        </div>
        
        <Routes>
          <Route index element={<AuditsOverview />} />
          <Route path="list" element={<AuditsList />} />
          <Route path="trends" element={<AuditsTrends />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default Audits;
