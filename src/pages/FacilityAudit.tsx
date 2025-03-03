
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from 'lucide-react';
import AuditForm from "@/components/facilities/audits/AuditForm";

const FacilityAudit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, fetch the facility details
  const facilityName = "Central Hospital"; // This would come from API

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/facilities/${id}`)}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">New Audit: {facilityName}</h1>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <AuditForm facilityId={Number(id)} facilityName={facilityName} />
        </div>
      </div>
    </Layout>
  );
};

export default FacilityAudit;
