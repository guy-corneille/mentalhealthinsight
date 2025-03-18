
import React from 'react';
import { Label } from '@/components/ui/label';

interface FacilityDisplayProps {
  facilityName: string;
}

const FacilityDisplay: React.FC<FacilityDisplayProps> = ({ facilityName }) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">
        Facility
      </Label>
      <div className="px-3 py-2 border rounded-md bg-muted/50">
        {facilityName}
      </div>
    </div>
  );
};

export default FacilityDisplay;
