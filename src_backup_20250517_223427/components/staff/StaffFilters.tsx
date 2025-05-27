
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon,
  FilterIcon,
  UserPlusIcon 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffListContext } from './StaffListContext';

interface StaffFiltersProps {
  showFacilityFilter: boolean;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({ showFacilityFilter = true }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    facilityFilter, 
    setFacilityFilter, 
    facilities,
    setCurrentStaff,
    setIsEditing,
    setModalOpen
  } = useStaffListContext();

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search staff..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {showFacilityFilter && facilities && facilities.length > 0 && (
          <div className="w-full sm:w-64">
            <Select 
              value={facilityFilter} 
              onValueChange={(value) => {
                console.log("Setting facility filter to:", value);
                setFacilityFilter(value);
              }}
            >
              <SelectTrigger className="bg-muted/50 border-none focus-visible:ring-1">
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities?.map(facility => (
                  <SelectItem key={facility.id} value={facility.id.toString()}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="border-none bg-muted/50">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button 
          className="bg-healthiq-600 hover:bg-healthiq-700"
          onClick={handleAddStaff}
        >
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>
    </div>
  );
};

export default StaffFilters;
