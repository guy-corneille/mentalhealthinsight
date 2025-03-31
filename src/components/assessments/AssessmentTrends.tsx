
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from '@/components/ui/spinner';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AssessmentStats from './AssessmentStats';

const AssessmentTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assessment Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive view of assessment statistics and trends
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Detailed Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <AssessmentStats />
        </TabsContent>
        
        <TabsContent value="trends" className="pt-6">
          <div className="animate-fade-in">
            <AssessmentStats />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentTrends;
