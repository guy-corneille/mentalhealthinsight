
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssessmentList from '@/components/assessments/AssessmentList';
import AssessmentTrends from '@/components/assessments/AssessmentTrends';

const Assessments: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze patient assessments and their trends over time.
          </p>
        </div>
        
        <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="list">Assessment List</TabsTrigger>
            <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
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
