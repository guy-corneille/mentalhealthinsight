
import React from 'react';
import { SearchIcon, PlusIcon, LayoutGridIcon, ListIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigate } from 'react-router-dom';

interface FacilitySearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  onClearFilters?: () => void;
}

const FacilitySearchFilters: React.FC<FacilitySearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
  onClearFilters
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center relative w-full sm:w-64">
        <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input 
          placeholder="Search facilities..." 
          className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select 
          value={typeFilter} 
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-32 bg-muted/50 border-none focus:ring-1">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="community center">Community</SelectItem>
          </SelectContent>
        </Select>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGridIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <span className="text-xs">Table</span>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button className="bg-healthiq-600 hover:bg-healthiq-700" onClick={() => navigate('/facilities/add')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>
    </div>
  );
};

export default FacilitySearchFilters;
