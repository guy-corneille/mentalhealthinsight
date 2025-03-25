
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, PlusIcon } from 'lucide-react';

interface AssessmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewAssessmentClick: () => void;
}

const AssessmentFilters: React.FC<AssessmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onNewAssessmentClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center relative w-full sm:w-64">
        <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input 
          placeholder="Search assessments..." 
          className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="border-none bg-muted/50">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button 
          className="bg-healthiq-600 hover:bg-healthiq-700"
          onClick={onNewAssessmentClick}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentFilters;
