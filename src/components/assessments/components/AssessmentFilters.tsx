
import React from 'react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/common/SearchInput';

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
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    console.log("Search submitted with query:", searchQuery);
    // The search is already handled by the onChange event in the SearchInput component
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="w-full sm:w-64">
        <SearchInput 
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search assessments..."
          className="w-full"
        />
      </form>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onNewAssessmentClick();
        }}
        className="bg-healthiq-600 hover:bg-healthiq-700"
      >
        New Assessment
      </Button>
    </div>
  );
};

export default AssessmentFilters;
