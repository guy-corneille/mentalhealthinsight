
import React from 'react';
import Layout from '@/components/layout/Layout';
import FacilityList from '@/components/facilities/FacilityList';

const Facilities: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities</h1>
          <p className="text-muted-foreground mt-1">
            Manage mental health facilities and monitor their performance.
          </p>
        </div>
        
        <FacilityList />
      </div>
    </Layout>
  );
};

export default Facilities;
