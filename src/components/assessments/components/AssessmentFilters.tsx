
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import SearchInput from './SearchInput';
import ScheduleAssessmentDialog from '../ScheduleAssessmentDialog';

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
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <SearchInput 
        placeholder="Search assessments..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsScheduleDialogOpen(true)}
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule</span>
        </Button>
        
        <Button 
          onClick={onNewAssessmentClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Assessment</span>
        </Button>
      </div>
      
      <ScheduleAssessmentDialog 
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      />
    </div>
  );
};

export default AssessmentFilters;
