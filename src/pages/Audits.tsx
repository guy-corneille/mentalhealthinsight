
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditList from '@/components/audits/AuditList';
import AuditTrends from '@/components/audits/AuditTrends';

const Audits: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facility Audits</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze facility audit data and trends across the healthcare system.
          </p>
        </div>
        
        <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="list">Audit List</TabsTrigger>
            <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
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
