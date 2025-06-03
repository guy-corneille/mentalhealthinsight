import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useReportActions } from './utils/reportUtils';
import { Assessment } from '@/features/assessments/types';

interface AssessmentPrintProps {
  assessment: {
    id: string | number;
    assessment_date: string;
    status: string;
    patient?: {
      first_name?: string;
      last_name?: string;
    };
    facility_name?: string;
    assessor_name?: string;
    overall_score?: number;
    criteria_scores?: Record<string, number>;
    notes?: string;
    facility?: string | number;
  };
}

const AssessmentPrint: React.FC<AssessmentPrintProps> = ({ assessment }) => {
  const { handlePrintReport } = useReportActions();

  const handlePrint = () => {
    // Convert the assessment data to the required Assessment type
    const formattedAssessment: Assessment = {
      id: assessment.id,
      patient: assessment.facility?.toString() || '',
      patient_name: assessment.patient ? 
        `${assessment.patient.first_name || ''} ${assessment.patient.last_name || ''}`.trim() : 
        undefined,
      facility: assessment.facility || '',
      facility_name: assessment.facility_name,
      assessment_date: assessment.assessment_date,
      score: assessment.overall_score || 0,
      evaluator: assessment.assessor_name || '',
      evaluator_name: assessment.assessor_name,
      notes: assessment.notes || '',
      status: assessment.status as 'scheduled' | 'completed' | 'missed',
      indicator_scores: assessment.criteria_scores ? 
        Object.entries(assessment.criteria_scores).map(([id, score]) => ({
          id: parseInt(id),
          indicator: parseInt(id),
          indicator_name: id,
          score: score,
          notes: ''
        })) : 
        []
    };

    handlePrintReport(formattedAssessment);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="flex items-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Print Report
    </Button>
  );
};

export default AssessmentPrint; 