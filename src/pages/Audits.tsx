
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditList from '@/components/assessments/audits/AuditList';
import AuditTrends from '@/components/assessments/audits/AuditTrends';

const Audits: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
          <p className="text-muted-foreground mt-1">
            View and manage facility audits and evaluation results.
          </p>
        </div>
        
        <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
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
