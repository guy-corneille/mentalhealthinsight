
import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CriteriaList from '@/components/assessments/CriteriaList';
import CriteriaForm from '@/components/assessments/CriteriaForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Criteria: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [criteriaType, setCriteriaType] = useState<'assessment' | 'audit'>('assessment');
  
  // Check if we're on the add or edit page
  const isFormPage = location.pathname.includes('/add') || location.pathname.includes('/edit');
  
  const handleTypeChange = (type: 'assessment' | 'audit') => {
    setCriteriaType(type);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Criteria</h1>
          <p className="text-muted-foreground mt-1">
            Define and manage the criteria used for facility audits and patient assessments.
          </p>
        </div>
        
        {!isFormPage && (
          <Tabs 
            defaultValue="assessment" 
            value={criteriaType}
            onValueChange={(value) => handleTypeChange(value as 'assessment' | 'audit')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="assessment">Assessment Criteria</TabsTrigger>
              <TabsTrigger value="audit">Audit Criteria</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <Routes>
          <Route path="/" element={<CriteriaList criteriaType={criteriaType} />} />
          <Route path="add" element={<CriteriaForm criteriaType={criteriaType} />} />
          <Route path="edit/:id" element={<CriteriaForm />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default Criteria;
