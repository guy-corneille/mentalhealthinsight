
import React from 'react';
import { Button } from '@/components/ui/button';
import SearchInput from './SearchInput';

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
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <SearchInput 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search assessments..."
        className="w-full sm:w-64"
      />
      <Button
        onClick={onNewAssessmentClick}
        className="bg-healthiq-600 hover:bg-healthiq-700"
      >
        New Assessment
      </Button>
    </div>
  );
};

export default AssessmentFilters;
