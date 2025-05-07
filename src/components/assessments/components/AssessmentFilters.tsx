
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="w-full sm:w-64 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          className="w-full pl-9"
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
