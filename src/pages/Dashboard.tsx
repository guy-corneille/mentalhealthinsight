
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardContent from '@/components/dashboard/Dashboard';

const Dashboard: React.FC = () => {
  useEffect(() => {
    console.log("Dashboard page mounted");
  }, []);

  console.log("Dashboard page rendering");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all facilities, staff, and evaluation frameworks.
          </p>
        </div>
        
        <DashboardContent />
      </div>
    </Layout>
  );
};

export default Dashboard;
