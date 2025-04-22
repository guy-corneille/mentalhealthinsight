
import React, { useEffect } from 'react';
import StepProgress from './StepProgress';
import AuditStepContent from './AuditStepContent';
import AuditStepNavigation from './AuditStepNavigation';
import { useAuditForm } from './useAuditForm';
import { AuditFormProps } from './types';

const AuditForm: React.FC<AuditFormProps> = ({ facilityId, facilityName }) => {
  const {
    currentStep,
    formData,
    isLoading,
    criteria,
    setCriteria,
    nextStep,
    prevStep,
    setCriteriaScore,
    setNotes,
    submitAudit
  } = useAuditForm(facilityId, facilityName);

  // Define derived data for the form
  const categories = ['Facility', 'Staff', 'Services', 'Quality', 'Documentation'];
  const stepCompletion = 100; // We'll calculate this based on completed criteria
  const overallScore = formData.totalScore;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === categories.length - 1;

  // Mock audit criteria (to be replaced with API data)
  const auditCriteria = [
    { id: '1', category: 'Facility', description: 'Building is accessible', guidance: 'Check ramps, elevators', weight: 2 },
    { id: '2', category: 'Facility', description: 'Clean environment', guidance: 'Inspect cleanliness', weight: 1 }
  ];

  // Map to useAuditForm equivalent functions
  const handleRatingChange = (criterionId: string, rating: any) => {
    setCriteriaScore(Number(criterionId), rating === 'pass' ? 100 : rating === 'partial' ? 50 : 0);
  };

  const handleNotesChange = (criterionId: string, notes: string) => {
    setCriteriaScore(
      Number(criterionId), 
      formData.criteria.find(c => c.id === Number(criterionId))?.score || 0, 
      notes
    );
  };

  const handleSubmitAudit = () => {
    submitAudit();
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <StepProgress 
        step={currentStep} 
        categories={categories}
        totalSteps={categories.length}
        setStep={(step) => nextStep()} // We'll just use nextStep for now
      />
      
      <AuditStepContent
        step={currentStep}
        categories={categories}
        currentCriteria={auditCriteria}
        stepCompletion={stepCompletion}
        ratings={{}}
        handleRatingChange={handleRatingChange}
        handleNotesChange={handleNotesChange}
      />
      
      <AuditStepNavigation
        step={currentStep}
        totalSteps={categories.length}
        stepCompletion={stepCompletion}
        overallScore={overallScore}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmitAudit={handleSubmitAudit}
        loading={isLoading}
      />
    </div>
  );
};

export default AuditForm;
