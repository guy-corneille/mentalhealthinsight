
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FacilityList from '@/components/facilities/FacilityList';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';

/**
 * Facilities Page
 * Main page for viewing and managing mental health facilities
 */
const Facilities: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facilities</h1>
            <p className="text-muted-foreground mt-1">
              Manage mental health facilities and monitor their performance.
            </p>
          </div>
          
          {/* Add new facility button */}
          <Button 
            onClick={() => navigate('/facilities/add')}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>
        
        {/* Facility list component - now using API data */}
        <FacilityList />
      </div>
    </Layout>
  );
};

export default Facilities;
