
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
  PencilIcon, 
  PrinterIcon, 
  Trash2Icon,
  MoreHorizontalIcon 
} from 'lucide-react';
import { Assessment } from '../types';

interface AssessmentActionsProps {
  assessment: Assessment;
  onViewDetails: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onPrintReport: (assessment: Assessment) => void;
  onDeleteAssessment: (id: number) => void;
}

const AssessmentActions: React.FC<AssessmentActionsProps> = ({
  assessment,
  onViewDetails,
  onEditAssessment,
  onPrintReport,
  onDeleteAssessment
}) => {
  // Handle the case where assessment.id might be a string or number
  const handleDelete = () => {
    // Convert id to number if it's a string
    const numericId = typeof assessment.id === 'string' 
      ? parseInt(assessment.id, 10) 
      : assessment.id;
      
    onDeleteAssessment(numericId);
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
        <DropdownMenuItem onClick={() => onViewDetails(assessment)}>
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditAssessment(assessment)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Assessment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPrintReport(assessment)}>
          <PrinterIcon className="h-4 w-4 mr-2" />
          Print Report
        </DropdownMenuItem>
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
