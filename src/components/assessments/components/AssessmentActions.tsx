import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  EyeIcon, 
  ClipboardIcon,
  CalendarIcon,
  Trash2Icon,
  MoreHorizontalIcon 
} from 'lucide-react';
import { Assessment } from '../types';

interface AssessmentActionsProps {
  assessment: Assessment;
  onViewDetails: (assessment: Assessment) => void;
  onTakeAssessment: (assessment: Assessment) => void;
  onReschedule: (assessment: Assessment) => void;
  onDeleteAssessment: (id: number | string) => void;
}

const AssessmentActions: React.FC<AssessmentActionsProps> = ({
  assessment,
  onViewDetails,
  onTakeAssessment,
  onReschedule,
  onDeleteAssessment
}) => {
  const handleDelete = () => {
    onDeleteAssessment(assessment.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Assessment Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {assessment.status === 'scheduled' ? (
          <>
            <DropdownMenuItem onClick={() => onTakeAssessment(assessment)}>
              <ClipboardIcon className="h-4 w-4 mr-2" />
              Take Assessment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReschedule(assessment)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Reschedule
            </DropdownMenuItem>
          </>
        ) : assessment.status === 'completed' && (
        <DropdownMenuItem onClick={() => onViewDetails(assessment)}>
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-rose-600"
          onClick={handleDelete}
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssessmentActions;
