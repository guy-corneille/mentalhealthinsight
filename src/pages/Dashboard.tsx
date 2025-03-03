
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardContent from '@/components/dashboard/Dashboard';

const Dashboard: React.FC = () => {
  useEffect(() => {
    console.log("Dashboard page mounted");
    
    // Add some debug information about rendered elements
    const mainElement = document.querySelector('main');
    if (mainElement) {
      console.log("Main element exists:", mainElement);
    } else {
      console.warn("Main element not found in the DOM");
    }
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
