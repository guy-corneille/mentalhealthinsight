
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssessmentList from '@/components/assessments/AssessmentList';
import AssessmentTrends from '@/components/assessments/AssessmentTrends';
import { useNavigate, useLocation } from 'react-router-dom';

const Assessments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = location.hash === '#trends' ? 'trends' : 'list';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/assessments${value === 'trends' ? '#trends' : ''}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create, view, and manage individual patient assessments and evaluation results.
          </p>
        </div>
        
        <Tabs defaultValue={defaultTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="list">Assessment List</TabsTrigger>
            <TabsTrigger value="trends">Assessment Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6 mt-6">
            <AssessmentList />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6 mt-6">
            <AssessmentTrends />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Assessments;
