
import React from 'react';
import Layout from '@/components/layout/Layout';
import PatientList from '@/components/patients/PatientList';

const Patients: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient records and track their treatment progress.
          </p>
        </div>
        
        <PatientList />
      </div>
    </Layout>
  );
};

export default Patients;
