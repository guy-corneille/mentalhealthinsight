
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFacilities } from '@/services/facilityService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

export interface AuditStatsFiltersProps {
  onFilterChange: (filters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => void;
  // Optional timeRange and facilityId props to support both usage patterns
  timeRange?: string;
  setTimeRange?: (value: string) => void;
  facilityId?: number | string;
  setFacilityId?: (value: number | string) => void;
}

const AuditStatsFilters: React.FC<AuditStatsFiltersProps> = ({ 
  onFilterChange,
  timeRange,
  setTimeRange,
  facilityId: externalFacilityId,
  setFacilityId: setExternalFacilityId
}) => {
  const [localFacilityId, setLocalFacilityId] = useState<number | undefined>(
    typeof externalFacilityId === 'number' ? externalFacilityId : undefined
  );
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { data: facilities } = useFacilities();
  
  const handleApplyFilters = () => {
    // Call onFilterChange with the current filter values
    onFilterChange({
      facilityId: localFacilityId,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    });

    // If we have external state management, update that too
    if (setExternalFacilityId && typeof localFacilityId === 'number') {
      setExternalFacilityId(localFacilityId);
    }
  };
  
  const handleResetFilters = () => {
    setLocalFacilityId(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    
    onFilterChange({
      facilityId: undefined,
      startDate: undefined,
      endDate: undefined,
    });

    // If we have external state management, update that too
    if (setExternalFacilityId) {
      setExternalFacilityId('');
    }
  };

  // Handle facility selection
  const handleFacilityChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    setLocalFacilityId(numValue);
    
    // If we have external state management, update that too
    if (setExternalFacilityId) {
      setExternalFacilityId(value);
    }
  };

  return (
    <CardContent className="space-y-4">
      <h3 className="text-lg font-medium">Filter Audit Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facility">Facility</Label>
          <Select
            value={localFacilityId?.toString() || ""}
            onValueChange={handleFacilityChange}
          >
            <SelectTrigger id="facility">
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Facilities</SelectItem>
              {facilities?.map((facility) => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Time range selector (for backward compatibility) */}
        {timeRange !== undefined && setTimeRange && (
          <div className="space-y-2">
            <Label htmlFor="timeRange">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="timeRange">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Start date field */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End date field */}
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </CardContent>
  );
};

export default AuditStatsFilters;
