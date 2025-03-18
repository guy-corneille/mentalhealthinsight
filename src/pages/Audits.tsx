
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditList from '@/components/assessments/audits/AuditList';
import AuditTrends from '@/components/assessments/audits/AuditTrends';
import { useNavigate, useLocation } from 'react-router-dom';

const Audits: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = location.hash === '#trends' ? 'trends' : 'list';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/audits${value === 'trends' ? '#trends' : ''}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
          <p className="text-muted-foreground mt-1">
            View and manage facility audits and evaluation results.
          </p>
        </div>
        
        <Tabs defaultValue={defaultTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="list">Audit List</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6 mt-6">
            <AuditList />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6 mt-6">
            <AuditTrends />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Audits;
