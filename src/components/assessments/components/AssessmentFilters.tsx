
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';

interface AssessmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewAssessmentClick: () => void;
}

const AssessmentFilters: React.FC<AssessmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onNewAssessmentClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex-1 max-w-md">
        <SearchInput
          placeholder="Search patients, evaluators, facilities..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>
      
      <div className="flex gap-2 self-end">
        <Button
          onClick={onNewAssessmentClick}
          className="bg-healthiq-600 hover:bg-healthiq-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentFilters;
