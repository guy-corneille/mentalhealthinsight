
import React from 'react';
import { SearchIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AssessmentListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewAssessmentDialog: () => void;
}

const AssessmentListHeader: React.FC<AssessmentListHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNewAssessmentDialog
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
          onClick={onOpenNewAssessmentDialog}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentListHeader;
