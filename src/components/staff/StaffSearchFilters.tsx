
import React from 'react';
import { SearchIcon, BuildingIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facility } from './types';

interface StaffSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  facilityFilter: string;
  setFacilityFilter: (facilityId: string) => void;
  facilities: Facility[];
}

const StaffSearchFilters: React.FC<StaffSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  facilityFilter,
  setFacilityFilter,
  facilities,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center relative w-full sm:w-64">
        <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input 
          placeholder="Search staff..." 
          className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select 
          value={facilityFilter} 
          onValueChange={setFacilityFilter}
        >
          <SelectTrigger className="w-[180px] bg-muted/50 border-none focus-visible:ring-1">
            <BuildingIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by facility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Facilities</SelectItem>
            {facilities.map(facility => (
              <SelectItem key={facility.id} value={facility.id.toString()}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StaffSearchFilters;
