
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
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
import { useToast } from "@/hooks/use-toast";
import NewAssessmentDialog from './NewAssessmentDialog';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Spinner } from '@/components/ui/spinner';

interface Assessment {
  id: number;
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

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch assessments using React Query
  const { data: assessments, isLoading, error } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const response = await api.get('/assessments/');
      return response.data as Assessment[];
    }
  });

  const handleCreateAssessment = (patientId: string, facilityId: string) => {
    toast({
      title: "Assessment started",
      description: `New assessment for patient ${patientId} at facility ID: ${facilityId}`,
    });
    
    setIsDialogOpen(false);
    onStartAssessment(patientId, facilityId);
  };

  // Filter assessments based on search query
  const filteredAssessments = assessments?.filter((assessment: Assessment) => {
    const searchText = searchQuery.toLowerCase();
    return (
      String(assessment.id).includes(searchText) ||
      (assessment.patient_name || assessment.patient).toLowerCase().includes(searchText) ||
      (assessment.facility_name || assessment.facility).toLowerCase().includes(searchText) ||
      (assessment.notes && assessment.notes.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search assessments..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-none bg-muted/50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button 
            className="bg-healthiq-600 hover:bg-healthiq-700"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-2">Loading assessments...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-500">
            <p>Error loading assessments</p>
            <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
          </div>
        ) : (
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
                {filteredAssessments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No assessments found. Create a new assessment to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments?.map((assessment: Assessment) => {
                    // Calculate score color based on value
                    const scoreColor = 
                      assessment.score >= 80 ? 'bg-emerald-500' : 
                      assessment.score >= 60 ? 'bg-amber-500' : 
                      'bg-rose-500';
                      
                    return (
                      <TableRow key={assessment.id}>
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <NewAssessmentDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateAssessment={handleCreateAssessment}
      />
    </div>
  );
};

export default AssessmentList;
