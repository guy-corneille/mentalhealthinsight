import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AuditList from '@/components/assessments/audits/AuditList';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from 'lucide-react';
import NewAuditDialog from '@/components/assessments/audits/NewAuditDialog';
import ScheduleAuditDialog from '@/components/assessments/audits/ScheduleAuditDialog';
import { usePageAuth } from '@/hooks/usePageAuth';

const Audits: React.FC = () => {
  // Protect at evaluator level
  usePageAuth('evaluator');

  const navigate = useNavigate();
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [isScheduleAuditDialogOpen, setIsScheduleAuditDialogOpen] = useState(false);

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
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsScheduleAuditDialogOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
            <Button 
              className="bg-healthiq-600 hover:bg-healthiq-700"
              onClick={() => setIsNewAuditDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Audit
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <AuditList />
        </div>
      </div>
      
      <NewAuditDialog 
        open={isNewAuditDialogOpen}
        onOpenChange={setIsNewAuditDialogOpen}
        onFacilitySelect={handleFacilitySelect}
      />
      
      <ScheduleAuditDialog
        open={isScheduleAuditDialogOpen}
        onOpenChange={setIsScheduleAuditDialogOpen}
      />
    </Layout>
  );
};

export default Audits;
