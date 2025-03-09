
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FacilityPerformanceReport from '@/components/reports/FacilityPerformanceReport';
import StaffEfficiencyReport from '@/components/reports/StaffEfficiencyReport';
import PatientOutcomesReport from '@/components/reports/PatientOutcomesReport';
import { Spinner } from '@/components/ui/spinner';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("facilities");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    // Add a small delay to prevent UI freezing when switching tabs
    setTimeout(() => {
      setActiveTab(value);
      setIsLoading(false);
    }, 300); // Increased delay for better user experience
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Access and generate detailed reports about facilities, staff, and patient outcomes.
          </p>
        </div>
        
        <Tabs defaultValue="facilities" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="facilities">Facility Performance</TabsTrigger>
            <TabsTrigger value="staff">Staff Efficiency</TabsTrigger>
            <TabsTrigger value="patients">Patient Outcomes</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <TabsContent value="facilities" className="mt-0">
                <FacilityPerformanceReport />
              </TabsContent>
              
              <TabsContent value="staff" className="mt-0">
                <StaffEfficiencyReport />
              </TabsContent>
              
              <TabsContent value="patients" className="mt-0">
                <PatientOutcomesReport />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
