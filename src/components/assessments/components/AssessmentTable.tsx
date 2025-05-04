
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import AssessmentActions from './AssessmentActions';
import { Assessment } from '../types';
import { useAuth } from '@/contexts/AuthContext';

interface SortableHeaderProps {
  column: string;
  label: string;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label, sortBy, sortDirection, onSort }) => {
  return (
    <Button 
      variant="ghost" 
      className="p-0 h-auto font-semibold flex items-center text-xs"
      onClick={() => onSort(column)}
    >
      {label}
      {sortBy === column ? (
        sortDirection === 'asc' ? 
          <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
          <ArrowDownIcon className="h-3 w-3 ml-1" />
      ) : (
        <ArrowUpDownIcon className="h-3 w-3 ml-1" />
      )}
    </Button>
  );
};

interface AssessmentTableProps {
  assessments: Assessment[] | undefined;
  isLoading: boolean;
  error: Error | null;
  currentItems: Assessment[] | undefined;
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
  onSort
}) => {
  const { user } = useAuth();

  console.log("AssessmentTable - Received items:", assessments?.length || 0);
  console.log("AssessmentTable - Sort by:", sortBy, "Direction:", sortDirection);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-2">Loading assessments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-rose-500">
        <p>Error loading assessments</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                column="patient"
                label="Patient ID"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="patient_name"
                label="Patient"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="assessment_date"
                label="Date"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="score"
                label="Score"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="facility_name"
                label="Facility"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="evaluator_name"
                label="Evaluator"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!currentItems || currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No assessments found. Create a new assessment to get started.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((assessment: Assessment) => {
              const scoreColor = 
                assessment.score >= 80 ? 'bg-emerald-500' : 
                assessment.score >= 60 ? 'bg-amber-500' : 
                'bg-rose-500';
                
              return (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.patient}</TableCell>
                  <TableCell>{assessment.patient_name || 'Unknown'}</TableCell>
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
                  <TableCell>{assessment.evaluator_name || assessment.evaluator || user?.displayName || user?.username || 'Unknown'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {assessment.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <AssessmentActions 
                      assessment={assessment}
                      onViewDetails={onViewDetails}
                      onEditAssessment={onEditAssessment}
                      onPrintReport={onPrintReport}
                      onDeleteAssessment={onDeleteAssessment}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssessmentTable;
