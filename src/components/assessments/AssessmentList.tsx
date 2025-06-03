import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, MoreVertical, Eye, Calendar as CalendarIcon, Edit, Trash2, ClipboardCheck, CalendarClock, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PaginationControls from '@/components/common/PaginationControls';
import SearchInput from '@/components/common/SearchInput';
import NewAssessmentDialog from './NewAssessmentDialog';
import ScheduleAssessmentDialog from './components/ScheduleAssessmentDialog';
import AssessmentDetailsDialog from './components/AssessmentDetailsDialog';
import { Assessment } from '@/features/assessments/types';
import { useAssessments } from '@/features/assessments/hooks/useAssessments';
import { useReportActions } from './utils/reportUtils';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Layout from '@/components/layout/Layout';

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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSort(column);
      }}
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

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for dialogs - separate states for each dialog
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [rescheduleAssessment, setRescheduleAssessment] = useState<Assessment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Custom hooks for assessments and reports
  const { 
    assessments, 
    totalCount,
    currentPage,
    pageSize,
    isLoading, 
    error, 
    isFetching, 
    searchQuery, 
    handleSearchChange, 
    handleDeleteAssessment,
    handlePageChange,
    handlePageSizeChange,
    sortBy,
    sortDirection,
    handleSort,
    totalPages,
    refetch
  } = useAssessments();
  
  const { handlePrintReport } = useReportActions();

  // Event handlers
  const handleCreateAssessment = (patientId: string, facilityId: string) => {
    toast({
      title: "Assessment started",
      description: `New assessment for patient ${patientId}`,
    });
    
    setIsNewAssessmentDialogOpen(false);
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

  const handleReschedule = async () => {
    if (!rescheduleAssessment || !rescheduleDate) return;
    setIsRescheduling(true);
    try {
      await api.patch(`/api/assessments/${rescheduleAssessment.id}/`, {
        patient: rescheduleAssessment.patient,
        facility: rescheduleAssessment.facility,
        scheduled_date: new Date(rescheduleDate).toISOString(),
        status: 'scheduled'
      });
      toast({ title: 'Assessment Rescheduled', description: 'The assessment has been rescheduled.' });
      setRescheduleAssessment(null);
      setRescheduleDate('');
      refetch();
    } catch (err) {
      console.error('Error rescheduling assessment:', err);
      toast({ 
        title: 'Error', 
        description: 'Failed to reschedule assessment. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';  // Green for 75 and above
    if (score >= 69) return 'bg-yellow-500';   // Yellow for 69-74
    if (score >= 50) return 'bg-orange-500';   // Orange for 50-68
    return 'bg-red-500';                       // Red for below 50
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateDisplay = (assessment: Assessment) => {
    const isScheduled = assessment.status === 'scheduled';
    const date = isScheduled ? assessment.scheduled_date : assessment.assessment_date;
    if (!date) return '—';
    
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div className="flex flex-col">
        <span className="font-medium">{formattedDate}</span>
        <span className="text-sm text-muted-foreground">{formattedTime}</span>
      </div>
    );
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className="space-y-6 animate-fade-in w-[90%] mx-auto">
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <SearchInput
                placeholder="Search patients, facilities..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(true)}
                className="flex items-center"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Assessment
              </Button>
              <Button
                onClick={() => setIsNewAssessmentDialogOpen(true)}
                className="flex items-center"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Start Assessment
              </Button>
            </div>
          </div>
          
          {/* Loading indicator for fetching */}
          {isFetching && !isLoading && (
            <div className="text-sm text-muted-foreground text-center py-2 bg-muted/30 rounded">
              Loading assessment data...
            </div>
          )}
          
          {/* Assessment Table */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader
                      column="patient"
                      label="Patient ID"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      column="patient_name"
                      label="Patient"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      column="status"
                      label="Status & Date"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      column="score"
                      label="Score"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      column="facility_name"
                      label="Facility"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      column="evaluator_name"
                      label="Evaluator"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Spinner size="lg" />
                      <span className="ml-2">Loading assessments...</span>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-rose-500">
                      <p>Error loading assessments</p>
                      <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
                    </TableCell>
                  </TableRow>
                ) : !assessments || assessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No assessments found
                      {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
                    </TableCell>
                  </TableRow>
                ) : (
                  assessments.map((assessment) => {
                    const isScheduled = assessment.status === 'scheduled';
                    const isCompleted = assessment.status === 'completed';
                    const isMissed = assessment.status === 'missed';
                    const dateToShow = isScheduled
                      ? assessment.scheduled_date
                      : assessment.assessment_date;
                    return (
                      <TableRow key={assessment.id}>
                        <TableCell>{assessment.patient}</TableCell>
                        <TableCell>{assessment.patient_name || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                              {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                            </span>
                            {getDateDisplay(assessment)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={assessment.score} 
                              className="w-16 h-2"
                              indicatorClassName={getScoreColor(assessment.score)}
                            />
                            <span className="text-sm font-medium">
                              {assessment.score}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{assessment.facility_name || assessment.facility}</TableCell>
                        <TableCell>{assessment.evaluator_name || assessment.evaluator || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {assessment.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Contextual actions */}
                              {isScheduled && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => onStartAssessment(assessment.patient, String(assessment.facility))}
                                  >
                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                    Take Assessment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setRescheduleAssessment(assessment)}>
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Reschedule
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => navigate(`/assessments/view/${assessment.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteAssessment(assessment.id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
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
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalCount > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount} assessments
              </div>
              
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <select 
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm bg-muted/50 border rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* Assessment Details Dialog */}
      <AssessmentDetailsDialog
        assessment={viewingAssessment}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onPrintReport={handlePrintReport}
      />

      {/* New Assessment Dialog */}
      <NewAssessmentDialog 
        open={isNewAssessmentDialogOpen}
        onOpenChange={setIsNewAssessmentDialogOpen}
        onCreateAssessment={handleCreateAssessment}
      />

      {/* Schedule Assessment Dialog */}
      <ScheduleAssessmentDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        onAssessmentScheduled={refetch}
      />

      {/* Reschedule Dialog */}
      {rescheduleAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reschedule Assessment</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRescheduleAssessment(null)}
                className="h-8 w-8"
              >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{rescheduleAssessment.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Facility</p>
                  <p className="font-medium">{rescheduleAssessment.facility_name}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Schedule</p>
                <p className="font-medium">
                  {rescheduleAssessment.scheduled_date ? new Date(rescheduleAssessment.scheduled_date).toLocaleString() : '—'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">New Schedule</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setRescheduleAssessment(null)}
                disabled={isRescheduling}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={isRescheduling || !rescheduleDate}
                className="min-w-[100px]"
              >
                {isRescheduling ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AssessmentList;
