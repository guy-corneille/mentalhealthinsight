
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFacilities } from '@/services/facilityService';

interface AuditStatsFiltersProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  facilityId: string | undefined;
  setFacilityId: (value: string | undefined) => void;
}

const AuditStatsFilters: React.FC<AuditStatsFiltersProps> = ({
  timeRange,
  setTimeRange,
  facilityId,
  setFacilityId
}) => {
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select 
        value={facilityId || 'all'} 
        onValueChange={(value) => setFacilityId(value === 'all' ? undefined : value)}
        disabled={facilitiesLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Facility" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Facilities</SelectItem>
            {facilities?.map((facility: any) => (
              <SelectItem key={facility.id} value={facility.id.toString()}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuditStatsFilters;
