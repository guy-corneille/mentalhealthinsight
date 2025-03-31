
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatsFiltersProps = {
  timeRange: string;
  setTimeRange: (value: string) => void;
  patientGroup: string;
  setPatientGroup: (value: string) => void;
};

const StatsFilters: React.FC<StatsFiltersProps> = ({
  timeRange,
  setTimeRange,
  patientGroup,
  setPatientGroup
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select value={patientGroup} onValueChange={setPatientGroup}>
        <SelectTrigger>
          <SelectValue placeholder="All Patient Groups" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Patient Groups</SelectItem>
            <SelectItem value="children">Children (0-17)</SelectItem>
            <SelectItem value="adults">Adults (18-64)</SelectItem>
            <SelectItem value="elderly">Elderly (65+)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Last 12 Months" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatsFilters;
