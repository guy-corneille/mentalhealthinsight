import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon,
  PlusIcon,
  FilterIcon,
  ArrowUpDownIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  Trash2Icon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Spinner } from '@/components/ui/spinner';
import PaginationControls from '@/components/common/PaginationControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

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
  created_at?: string;
  updated_at?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const fetchAssessments = useCallback(async () => {
    console.log('Fetching assessments from API');
    const response = await api.get<PaginatedResponse<Assessment>>('/assessments/');
    console.log('Assessment API response:', response);
    return response.results || [];
  }, []);

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['assessments'],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0
  });

  useEffect(() => {
    console.log('Component mounted or dialog closed, refetching assessments');
    refetch();
  }, [refetch, isDialogOpen]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/assessments/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      console.log('Assessment deleted, refetching data');
      refetch();
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateAssessment = (patientId: string, facilityId: string) => {
    toast({
      title: "Assessment started",
      description: `New assessment for patient ${patientId}`,
    });
    
    setIsDialogOpen(false);
    onStartAssessment(patientId, facilityId);
  };

  const handleViewAssessment = (assessment: Assessment) => {
    setViewingAssessment(assessment);
    setIsViewDialogOpen(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    toast({
      title: "Edit Assessment",
      description: `Editing assessment ${assessment.id} is not implemented yet.`,
    });
  };

  const handlePrintReport = (assessment: Assessment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    const evaluatorName = assessment.evaluator_name || assessment.evaluator || user?.displayName || user?.username || 'Unknown';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Assessment Report - ${assessment.patient_name || assessment.patient}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1 { color: #334155; }
            .header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #64748b; }
            .score { font-size: 24px; font-weight: bold; }
            .score-high { color: #10b981; }
            .score-medium { color: #f59e0b; }
            .score-low { color: #ef4444; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #ddd; padding-top: 10px; }
            @media print {
              body { margin: 0; padding: 15px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Patient Assessment Report</h1>
            <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          </div>
          
          <div class="section grid">
            <div>
              <p class="label">Patient ID:</p>
              <p>${assessment.patient}</p>
            </div>
            <div>
              <p class="label">Patient Name:</p>
              <p>${assessment.patient_name || 'Unknown'}</p>
            </div>
            <div>
              <p class="label">Facility:</p>
              <p>${assessment.facility_name || assessment.facility}</p>
            </div>
            <div>
              <p class="label">Assessment Date:</p>
              <p>${format(new Date(assessment.assessment_date), 'PPP')}</p>
            </div>
            <div>
              <p class="label">Evaluator:</p>
              <p>${evaluatorName}</p>
            </div>
            <div>
              <p class="label">Completed On:</p>
              <p>${assessment.created_at ? format(new Date(assessment.created_at), 'PPP') : 'N/A'}</p>
            </div>
          </div>
          
          <div class="section">
            <p class="label">Assessment Score:</p>
            <p class="score ${
              assessment.score >= 80 ? 'score-high' : 
              assessment.score >= 60 ? 'score-medium' : 
              'score-low'
            }">${assessment.score}%</p>
          </div>
          
          <div class="section">
            <p class="label">Notes:</p>
            <p>${assessment.notes || 'No notes provided.'}</p>
          </div>
          
          <div class="footer">
            <p>This report is confidential and intended only for authorized personnel.</p>
            <p>HealthIQ Assessment System</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();

    toast({
      title: "Report generated",
      description: "The assessment report has been prepared for printing.",
    });
  };

  const handleDeleteAssessment = (id: number) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredAssessments = data?.filter((assessment: Assessment) => {
    const searchText = searchQuery.toLowerCase();
    return (
      String(assessment.id).includes(searchText) ||
      (assessment.patient_name || assessment.patient).toLowerCase().includes(searchText) ||
      (assessment.facility_name || assessment.facility).toLowerCase().includes(searchText) ||
      (assessment.notes && assessment.notes.toLowerCase().includes(searchText))
    );
  });

  const totalItems = filteredAssessments?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const currentItems = filteredAssessments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

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
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-auto font-semibold flex items-center text-xs">
                      Date
                      <ArrowUpDownIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Evaluator</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredAssessments || filteredAssessments.length === 0 ? (
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Assessment Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewAssessment(assessment)}>
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAssessment(assessment)}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Assessment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintReport(assessment)}>
                                <PrinterIcon className="h-4 w-4 mr-2" />
                                Print Report
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-rose-600"
                                onClick={() => handleDeleteAssessment(assessment.id)}
                              >
                                <Trash2Icon className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            
            {filteredAssessments && filteredAssessments.length > 0 && (
              <div className="px-4 py-2 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} assessments
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={itemsPerPage.toString()} 
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="10 per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              View detailed information about this assessment.
            </DialogDescription>
          </DialogHeader>
          
          {viewingAssessment && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Patient ID</h4>
                  <p>{viewingAssessment.patient}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Patient Name</h4>
                  <p>{viewingAssessment.patient_name || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Facility</h4>
                  <p>{viewingAssessment.facility_name || viewingAssessment.facility}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{new Date(viewingAssessment.assessment_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Score</h4>
                  <p className={
                    viewingAssessment.score >= 80 ? 'text-emerald-600' : 
                    viewingAssessment.score >= 60 ? 'text-amber-600' : 
                    'text-rose-600'
                  }>
                    {viewingAssessment.score}%
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Evaluator</h4>
                  <p>{viewingAssessment.evaluator_name || viewingAssessment.evaluator || user?.displayName || user?.username || 'Current User'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Completed On</h4>
                  <p className="text-sm">{formatDate(viewingAssessment.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Updated On</h4>
                  <p className="text-sm">{formatDate(viewingAssessment.updated_at)}</p>
                </div>

                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                  <p className="whitespace-pre-wrap">{viewingAssessment.notes || 'No notes provided.'}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handlePrintReport(viewingAssessment)}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <NewAssessmentDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateAssessment={handleCreateAssessment}
      />
    </div>
  );
};

export default AssessmentList;
