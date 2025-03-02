
import React from 'react';
import { 
  ClipboardIcon, 
  SearchIcon,
  PlusIcon,
  FilterIcon,
  ArrowUpDownIcon,
  FileTextIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const AssessmentList: React.FC = () => {
  const assessments = [
    { 
      id: 'A-5001', 
      patientId: 'P-1001', 
      date: '2023-05-15', 
      score: 24,
      maxScore: 27,
      notes: 'Significant improvement in mood and sleep pattern',
      facility: 'Central Hospital'
    },
    { 
      id: 'A-5002', 
      patientId: 'P-1002', 
      date: '2023-05-12', 
      score: 18,
      maxScore: 21,
      notes: 'Reduced anxiety symptoms, still experiencing sleep disruption',
      facility: 'Eastern District Clinic'
    },
    { 
      id: 'A-5003', 
      patientId: 'P-1003', 
      date: '2023-05-10', 
      score: 15,
      maxScore: 27,
      notes: 'Mood stabilizing, adhering to medication regimen',
      facility: 'Northern Community Center'
    },
    { 
      id: 'A-5004', 
      patientId: 'P-1005', 
      date: '2023-05-18', 
      score: 12,
      maxScore: 15,
      notes: 'Showing improvement in trauma responses',
      facility: 'Central Hospital'
    },
    { 
      id: 'A-5005', 
      patientId: 'P-1006', 
      date: '2023-05-05', 
      score: 8,
      maxScore: 18,
      notes: 'Reduced compulsive behaviors, implementing coping strategies',
      facility: 'Southern District Hospital'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search assessments..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-none bg-muted/50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button className="bg-healthiq-600 hover:bg-healthiq-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[100px]">Patient</TableHead>
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
              {assessments.map((assessment) => {
                const scorePercentage = (assessment.score / assessment.maxScore) * 100;
                return (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.id}</TableCell>
                    <TableCell>{assessment.patientId}</TableCell>
                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={scorePercentage} 
                          className="h-2 w-16"
                          indicatorClassName={
                            scorePercentage >= 80 ? 'bg-emerald-500' : 
                            scorePercentage >= 60 ? 'bg-amber-500' : 
                            'bg-rose-500'
                          }
                        />
                        <span className="text-sm font-medium">
                          {assessment.score}/{assessment.maxScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{assessment.facility}</TableCell>
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
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentList;
