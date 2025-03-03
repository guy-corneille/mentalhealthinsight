
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CriteriaList from '@/components/assessments/CriteriaList';
import CriteriaForm from '@/components/assessments/CriteriaForm';

const Criteria: React.FC = () => {
  const location = useLocation();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Criteria</h1>
          <p className="text-muted-foreground mt-1">
            Define and manage evaluation criteria used across assessments and audits.
          </p>
        </div>
        
        <Routes>
          <Route path="/" element={<CriteriaList />} />
          <Route path="add" element={<CriteriaForm />} />
          <Route path="edit/:id" element={<CriteriaForm />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default Criteria;
