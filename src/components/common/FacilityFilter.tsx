import React from 'react';
import { useFacilities } from '@/services/facilityService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface FacilityFilterProps {
  selectedFacility?: number;
  onFacilityChange: (facilityId: number | undefined) => void;
}

const FacilityFilter: React.FC<FacilityFilterProps> = ({
  selectedFacility,
  onFacilityChange,
}) => {
  const { data: facilities = [], isLoading } = useFacilities();

  return (
    <Select
      value={selectedFacility?.toString() || 'all'}
      onValueChange={(value) => {
        if (value === 'all') {
          onFacilityChange(undefined);
        } else {
          onFacilityChange(parseInt(value));
        }
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[200px]">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Loading...</span>
          </div>
        ) : (
          <SelectValue placeholder="Select facility" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Facilities</SelectItem>
        {facilities.map((facility) => (
          <SelectItem key={facility.id} value={facility.id.toString()}>
            {facility.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FacilityFilter; 