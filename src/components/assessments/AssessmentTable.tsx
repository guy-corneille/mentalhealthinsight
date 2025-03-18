
import React from 'react';
import { 
  ArrowUpDownIcon,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AssessmentTableRow from './AssessmentTableRow';

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

interface AssessmentTableProps {
  assessments: Assessment[];
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ assessments }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-semibold flex items-center text-xs">
                Date
                <ArrowUpDownIcon className="h-3 w-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No assessments found. Create a new assessment to get started.
              </TableCell>
            </TableRow>
          ) : (
            assessments.map((assessment) => (
              <AssessmentTableRow key={assessment.id} assessment={assessment} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssessmentTable;
