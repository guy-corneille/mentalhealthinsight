
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

import NewAssessmentDialog from './NewAssessmentDialog';

// Import refactored components
import AssessmentTable from './components/AssessmentTable';
import AssessmentDetailsDialog from './components/AssessmentDetailsDialog';
import AssessmentFilters from './components/AssessmentFilters';
import { Assessment } from './types';

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Data fetching without pagination
  const fetchAssessments = useCallback(async () => {
    console.log(`Fetching all assessments, search: ${searchQuery || 'none'}`);
    
    try {
      // Setting a large page_size to effectively get all items
      // We're removing pagination, so we'll request a large number of items
      const response = await api.get('/assessments/', {
        params: {
          search: searchQuery || undefined,
          page_size: 1000 // Request a large number to get all items
        }
      });
      
      console.log(`API Success - Results count: ${response.data.results?.length}, Total: ${response.data.count}`);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }, [searchQuery]);

  const { 
    data: assessments, 
    isLoading, 
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['assessments', searchQuery],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always refetch when needed
  });

  // Mutation for deleting assessments
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => {
      console.log(`Deleting assessment with ID: ${id} (type: ${typeof id})`);
      return api.delete(`/assessments/${id}/`);
    },
    onSuccess: () => {
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
      
      // Invalidate and refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      refetch();
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

  const handleDeleteAssessment = (id: number | string) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      console.log(`Confirming deletion of assessment ID: ${id} (type: ${typeof id})`);
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

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
          currentItems={assessments} // Pass all items directly
          onViewDetails={handleViewAssessment}
          onEditAssessment={handleEditAssessment}
          onPrintReport={handlePrintReport}
          onDeleteAssessment={handleDeleteAssessment}
        />
      </div>

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
