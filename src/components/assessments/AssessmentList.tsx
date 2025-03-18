
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import NewAssessmentDialog from './NewAssessmentDialog';
import AssessmentListHeader from './AssessmentListHeader';
import AssessmentTable from './AssessmentTable';
import AssessmentLoadingState from './AssessmentLoadingState';
import AssessmentErrorState from './AssessmentErrorState';
import { useAssessments } from '@/hooks/useAssessments';

interface AssessmentListProps {
  onStartAssessment: (patientId: string, facilityId: string) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onStartAssessment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch assessments from API
  const { data: apiResponse, isLoading, error } = useAssessments();

  // Extract assessments from the response
  const assessments = apiResponse?.results || [];

  const handleCreateAssessment = (patientId: string, facilityId: string) => {
    toast({
      title: "Assessment started",
      description: `New assessment for patient ${patientId} at facility ID: ${facilityId}`,
    });
    
    setIsDialogOpen(false);
    onStartAssessment(patientId, facilityId);
  };

  // Filter assessments based on search query
  const filteredAssessments = assessments.filter((assessment) => {
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
      <AssessmentListHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewAssessmentDialog={() => setIsDialogOpen(true)}
      />
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        {isLoading ? (
          <AssessmentLoadingState />
        ) : error ? (
          <AssessmentErrorState />
        ) : (
          <AssessmentTable assessments={filteredAssessments} />
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
