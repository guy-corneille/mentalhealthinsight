import React from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import { usePageAuth } from '@/hooks/usePageAuth';

const DashboardPage: React.FC = () => {
  // Protect at viewer level - all authenticated users can access
  usePageAuth('viewer');
  
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
