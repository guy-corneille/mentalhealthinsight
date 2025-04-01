import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditList from '@/components/assessments/audits/AuditList';
import AuditTrends from '@/components/assessments/audits/AuditTrends';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import NewAuditDialog from '@/components/assessments/audits/NewAuditDialog';

const Audits: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = location.hash === '#trends' ? 'trends' : 'list';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    navigate(`/audits${value === 'trends' ? '#trends' : ''}`);
  };

  const handleFacilitySelect = (facilityId: number) => {
    console.log("Selected facility for audit:", facilityId);
    navigate(`/facilities/audit/${facilityId}`);
    setIsNewAuditDialogOpen(false);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
            <p className="text-muted-foreground mt-1">
              View and manage facility audits and evaluation results.
            </p>
          </div>
          
          <Button 
            className="bg-healthiq-600 hover:bg-healthiq-700"
            onClick={() => setIsNewAuditDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Start Audit
          </Button>
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
      
      <NewAuditDialog 
        open={isNewAuditDialogOpen}
        onOpenChange={setIsNewAuditDialogOpen}
        onFacilitySelect={handleFacilitySelect}
      />
    </Layout>
  );
};

export default Audits;
