
import React from 'react';
import StepProgress from './StepProgress';
import AuditStepContent from './AuditStepContent';
import AuditStepNavigation from './AuditStepNavigation';
import { useAuditForm } from './useAuditForm';
import { AuditFormProps } from './types';

const AuditForm: React.FC<AuditFormProps> = ({ facilityId, facilityName }) => {
  const {
    step,
    setStep,
    ratings,
    loading,
    categories,
    auditCriteria,
    stepCompletion,
    overallScore,
    isLastStep,
    isFirstStep,
    handleRatingChange,
    handleNotesChange,
    handleSubmitAudit,
    nextStep,
    prevStep
  } = useAuditForm(facilityId, facilityName);

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <StepProgress 
        step={step} 
        categories={categories}
        totalSteps={auditCriteria.length}
        setStep={setStep}
      />
      
      <AuditStepContent
        step={step}
        categories={categories}
        currentCriteria={auditCriteria[step]}
        stepCompletion={stepCompletion}
        ratings={ratings}
        handleRatingChange={handleRatingChange}
        handleNotesChange={handleNotesChange}
      />
      
      <AuditStepNavigation
        step={step}
        totalSteps={auditCriteria.length}
        stepCompletion={stepCompletion}
        overallScore={overallScore}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmitAudit={handleSubmitAudit}
        loading={loading}
      />
    </div>
  );
};

export default AuditForm;
