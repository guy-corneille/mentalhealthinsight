
/**
 * Assessment List Component
 * 
 * This component displays a list of assessments with filtering, pagination,
 * and action capabilities. It provides the main interface for managing assessments.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Import components
import NewAssessmentDialog from '@/components/assessments/NewAssessmentDialog';
import AssessmentTable from '@/components/assessments/components/AssessmentTable';
import AssessmentDetailsDialog from '@/components/assessments/components/AssessmentDetailsDialog';
import AssessmentFilters from '@/components/assessments/components/AssessmentFilters';
import PaginationControls from '@/components/common/PaginationControls';
import { Assessment } from '@/features/assessments/types';

// Import custom hooks
import { useAssessments } from '@/components/assessments/hooks/useAssessments';
import { useReportActions } from '@/components/assessments/utils/reportUtils';

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
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
    handlePageSizeChange
  } = useAssessments();
  
  const { handlePrintReport } = useReportActions();

  // Event handlers
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

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  console.log(`AssessmentList - Total count: ${totalCount}, Page size: ${pageSize}, Total pages: ${totalPages}`);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filter Controls */}
      <AssessmentFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewAssessmentClick={() => setIsDialogOpen(true)}
      />
      
      {/* Loading indicator for fetching */}
      {isFetching && (
        <div className="text-sm text-muted-foreground text-center py-2 bg-muted/30 rounded">
          Loading assessment data...
        </div>
      )}
      
      {/* Assessment Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        <AssessmentTable
          assessments={assessments}
          isLoading={isLoading}
          error={error as Error}
          currentItems={assessments}
          onViewDetails={handleViewAssessment}
          onEditAssessment={handleEditAssessment}
          onPrintReport={handlePrintReport}
          onDeleteAssessment={handleDeleteAssessment}
        />
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

      {/* Assessment Details Dialog */}
      <AssessmentDetailsDialog
        assessment={viewingAssessment}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onPrintReport={handlePrintReport}
      />

      {/* New Assessment Dialog */}
      <NewAssessmentDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateAssessment={handleCreateAssessment}
      />
    </div>
  );
};

export default AssessmentList;
