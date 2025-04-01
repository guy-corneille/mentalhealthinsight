
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from '@/components/ui/spinner';
import AssessmentReports from '@/components/reports/AssessmentReports';
import AuditReports from '@/components/reports/AuditReports';
import { useQuery } from '@tanstack/react-query';
import reportService from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("assessments");
  const { toast } = useToast();

  // Pre-fetch both data sets to make switching tabs faster
  const { isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['assessmentReports'],
    queryFn: () => reportService.getAssessmentStatistics(),
    enabled: activeTab === "assessments",
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Failed to load assessment reports",
          description: error.message || "Please try again later",
        });
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { isLoading: isLoadingAudits } = useQuery({
    queryKey: ['auditReports'],
    queryFn: () => reportService.getAuditStatistics(),
    enabled: activeTab === "audits",
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Failed to load audit reports",
          description: error.message || "Please try again later",
        });
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = (activeTab === "assessments" && isLoadingAssessments) || 
                    (activeTab === "audits" && isLoadingAudits);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Access and generate detailed reports about patient assessments and facility audits.
          </p>
        </div>
        
        <Tabs defaultValue="assessments" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
            <TabsTrigger value="assessments">Assessment Reports</TabsTrigger>
            <TabsTrigger value="audits">Audit Reports</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <TabsContent value="assessments" className="mt-0">
                <AssessmentReports />
              </TabsContent>
              
              <TabsContent value="audits" className="mt-0">
                <AuditReports />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
