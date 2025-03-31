
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditStatsOverview from './AuditStatsOverview';
import AuditStatsDetails from './AuditStatsDetails';

const AuditTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive view of audit statistics and trends
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Detailed Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <AuditStatsOverview />
        </TabsContent>
        
        <TabsContent value="trends" className="pt-6">
          <div className="animate-fade-in">
            <AuditStatsDetails />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrends;
