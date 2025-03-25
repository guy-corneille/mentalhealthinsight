
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
    // Use the exact ID as provided by the API without trying to extract numeric parts
    // This ensures we're using the correct identifier for API operations
    const id = assessment.id;
    
    // Since onDeleteAssessment expects a number, ensure we convert string IDs to numbers when possible
    if (typeof id === 'number') {
      onDeleteAssessment(id);
    } else if (typeof id === 'string') {
      // Try to convert the entire string to a number if possible
      const numId = Number(id);
      
      // Check if conversion was successful and resulted in a valid number
      if (!isNaN(numId)) {
        console.log(`Converting string ID "${id}" to number: ${numId}`);
        onDeleteAssessment(numId);
      } else {
        // If the ID is a complex string (like a UUID), log this issue
        console.error(`Cannot convert assessment ID "${id}" to a number. API expects numeric IDs.`);
        alert("Error: This assessment has a non-numeric ID and cannot be deleted through this interface.");
      }
    }
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
