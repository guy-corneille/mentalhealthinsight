
import React from 'react';
import Layout from '@/components/layout/Layout';
import StaffList from '@/components/staff/StaffList';

const Staff: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage healthcare staff members and their facility assignments.
          </p>
        </div>
        
        <StaffList />
      </div>
    </Layout>
  );
};

export default Staff;
