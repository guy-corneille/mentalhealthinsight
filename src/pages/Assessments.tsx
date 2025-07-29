import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import AssessmentList from '@/components/assessments/AssessmentList';
import AssessmentEvaluation from '@/components/assessments/AssessmentEvaluation';
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from 'lucide-react';
import NewAssessmentDialog from '@/components/assessments/NewAssessmentDialog';
import ScheduleAssessmentDialog from '@/components/assessments/components/ScheduleAssessmentDialog';
import { useAssessments } from '@/features/assessments/hooks/useAssessments';
import { useNavigate } from 'react-router-dom';
import { usePageAuth } from '@/hooks/usePageAuth';

const Assessments: React.FC = () => {
  // Protect at evaluator level
  usePageAuth('evaluator');

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] = useState(false);
  const [isScheduleAssessmentDialogOpen, setIsScheduleAssessmentDialogOpen] = useState(false);

  const { refetch } = useAssessments();
  const navigate = useNavigate();

  const handleStartEvaluation = (patientId: string, facilityId: string, assessmentId?: string) => {
    setSelectedPatientId(patientId);
    setSelectedFacilityId(facilityId);
    setIsEvaluating(true);
    navigate(`/mhq/assessment/${patientId}`);
  };

  const handleCompleteEvaluation = () => {
    setIsEvaluating(false);
  };

  const handleCancelEvaluation = () => {
    setIsEvaluating(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Assessments</h1>
            <p className="text-muted-foreground mt-1">
              Create, view, and manage individual patient assessments and evaluation results.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsScheduleAssessmentDialogOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Assessment
            </Button>
            <Button 
              className="bg-healthiq-600 hover:bg-healthiq-700"
              onClick={() => setIsNewAssessmentDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        </div>
        
        {isEvaluating ? (
          <AssessmentEvaluation 
            patientId={selectedPatientId}
            facilityId={selectedFacilityId}
            onComplete={handleCompleteEvaluation}
            onCancel={handleCancelEvaluation}
          />
        ) : (
          <div className="space-y-6">
            <AssessmentList onStartAssessment={handleStartEvaluation} />
          </div>
        )}
      </div>
      
      <NewAssessmentDialog 
        open={isNewAssessmentDialogOpen}
        onOpenChange={setIsNewAssessmentDialogOpen}
        onCreateAssessment={handleStartEvaluation}
      />
      
      <ScheduleAssessmentDialog
        open={isScheduleAssessmentDialogOpen}
        onOpenChange={setIsScheduleAssessmentDialogOpen}
        onAssessmentScheduled={refetch}
      />
    </Layout>
  );
};

export default Assessments;
