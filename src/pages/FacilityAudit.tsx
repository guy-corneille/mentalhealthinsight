
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from 'lucide-react';
import AuditForm from "@/components/facilities/audits/AuditForm";
import { useFacility } from '@/services/facilityService';
import { Spinner } from "@/components/ui/spinner";

const FacilityAudit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log("Rendering FacilityAudit page for facility ID:", id);
  
  // Fetch the facility data
  const { data: facility, isLoading, error } = useFacility(Number(id));

  if (error) {
    console.error("Error fetching facility data:", error);
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error loading facility
          </h2>
          <p className="text-gray-600 mb-4">
            There was a problem loading the facility data. Please try again.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/facilities')}
          >
            Back to Facilities
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
          <span className="ml-2">Loading facility details...</span>
        </div>
      </Layout>
    );
  }

  console.log("Facility data loaded:", facility);

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
          <h1 className="text-3xl font-bold tracking-tight">New Audit: {facility?.name}</h1>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <AuditForm facilityId={Number(id)} facilityName={facility?.name || ""} />
        </div>
      </div>
    </Layout>
  );
};

export default FacilityAudit;
