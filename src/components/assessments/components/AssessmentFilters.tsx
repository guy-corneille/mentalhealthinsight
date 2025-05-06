
import React from 'react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/common/SearchInput';
import { Search } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="w-full sm:w-64 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Search assessments..."
          value={searchQuery}
          onChange={handleInputChange}
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
