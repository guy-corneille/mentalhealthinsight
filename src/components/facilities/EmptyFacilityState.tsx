
import React from 'react';
import { BuildingIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface EmptyFacilityStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyFacilityState: React.FC<EmptyFacilityStateProps> = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
      <BuildingIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No facilities found</h3>
      <p className="text-muted-foreground text-sm mt-1">
        Try adjusting your search or filter criteria
      </p>
      {hasFilters ? (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      ) : (
        <Button 
          className="mt-4 bg-healthiq-600 hover:bg-healthiq-700"
          onClick={() => navigate('/facilities/add')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Your First Facility
        </Button>
      )}
    </div>
  );
};

export default EmptyFacilityState;
