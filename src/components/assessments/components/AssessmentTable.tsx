
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  FileEdit, 
  Trash2, 
  FileText, 
  Eye, 
  Check, 
  Clock, 
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Assessment } from '@/features/assessments/types';
import { format } from 'date-fns';

interface AssessmentTableProps {
  assessments: Assessment[];
  isLoading: boolean;
  error: Error | null;
  currentItems: Assessment[];
  onViewDetails: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onPrintReport: (assessment: Assessment) => void;
  onDeleteAssessment: (id: number | string) => void;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({
  assessments,
  isLoading,
  error,
  currentItems,
  onViewDetails,
  onEditAssessment,
  onPrintReport,
  onDeleteAssessment,
  sortBy,
  sortDirection,
  onSort,
}) => {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Completed
            </Badge>
          </div>
        );
      case 'scheduled':
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Scheduled
            </Badge>
          </div>
        );
      case 'incomplete':
        return (
          <div className="flex items-center">
            <X className="h-4 w-4 mr-1 text-red-500" />
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Incomplete
            </Badge>
          </div>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-9 w-9" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-2">Failed to load assessments</p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }
  
  if (!currentItems || currentItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium mb-2">No assessments found</p>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort('patient_name')}>
            Patient {getSortIcon('patient_name')}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('facility_name')}>
            Facility {getSortIcon('facility_name')}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('status')}>
            Status {getSortIcon('status')}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('assessment_date')}>
            Date {getSortIcon('assessment_date')}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('score')}>
            Score {getSortIcon('score')}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('evaluator_name')}>
            Evaluator {getSortIcon('evaluator_name')}
          </TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.map((assessment: Assessment) => (
          <TableRow key={assessment.id}>
            <TableCell className="font-medium">{assessment.patient_name || assessment.patient}</TableCell>
            <TableCell>{assessment.facility_name || assessment.facility}</TableCell>
            <TableCell>{getStatusBadge(assessment.status)}</TableCell>
            <TableCell>
              {assessment.assessment_date ? 
                format(new Date(assessment.assessment_date), 'MMM d, yyyy') : 
                'N/A'
              }
            </TableCell>
            <TableCell>
              {assessment.status === 'completed' ? 
                <span className="font-semibold">{assessment.score}</span> : 
                <span className="text-muted-foreground">-</span>
              }
            </TableCell>
            <TableCell>{assessment.evaluator_name || assessment.evaluator || 'Unassigned'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(assessment)}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditAssessment(assessment)}>
                    <FileEdit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPrintReport(assessment)}>
                    <FileText className="mr-2 h-4 w-4" /> Print Report
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteAssessment(assessment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssessmentTable;
