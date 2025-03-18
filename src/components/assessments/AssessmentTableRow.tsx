
import React from 'react';
import { 
  FileTextIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface Assessment {
  id: number | string;
  patient: string;
  patient_name?: string;
  facility: string;
  facility_name?: string;
  assessment_date: string;
  score: number;
  notes: string;
  evaluator: string;
  evaluator_name?: string;
}

interface AssessmentTableRowProps {
  assessment: Assessment;
}

const AssessmentTableRow: React.FC<AssessmentTableRowProps> = ({ assessment }) => {
  // Calculate score color based on value
  const scoreColor = 
    assessment.score >= 80 ? 'bg-emerald-500' : 
    assessment.score >= 60 ? 'bg-amber-500' : 
    'bg-rose-500';

  return (
    <TableRow>
      <TableCell className="font-medium">{assessment.id}</TableCell>
      <TableCell>{assessment.patient_name || assessment.patient}</TableCell>
      <TableCell>{new Date(assessment.assessment_date).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Progress 
            value={assessment.score} 
            className="h-2 w-16"
            indicatorClassName={scoreColor}
          />
          <span className="text-sm font-medium">
            {assessment.score}%
          </span>
        </div>
      </TableCell>
      <TableCell>{assessment.facility_name || assessment.facility}</TableCell>
      <TableCell className="max-w-xs truncate">
        {assessment.notes}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Assessment Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileTextIcon className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Assessment</DropdownMenuItem>
            <DropdownMenuItem>Print Report</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default AssessmentTableRow;
