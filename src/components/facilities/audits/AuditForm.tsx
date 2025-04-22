
import React, { useEffect, useState } from 'react';
import StepProgress from './StepProgress';
import AuditStepContent from './AuditStepContent';
import AuditStepNavigation from './AuditStepNavigation';
import { useAuditForm } from './useAuditForm';
import { AuditFormProps, Criterion, Rating, CriterionRating } from './types';

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

  const [ratings, setRatings] = useState<Record<string, CriterionRating>>({});
  
  // Define derived data for the form
  const categories = ['Facility', 'Staff', 'Services', 'Quality', 'Documentation'];
  const stepCompletion = calculateStepCompletion(currentStep, ratings);
  const overallScore = formData.totalScore;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === categories.length - 1;

  // Mock audit criteria - grouped by category
  const auditCriteria = [
    { id: '1', category: 'Facility', description: 'Building is accessible', guidance: 'Check ramps, elevators, doorways for wheelchair access', weight: 2 },
    { id: '2', category: 'Facility', description: 'Clean environment', guidance: 'Inspect cleanliness of all areas', weight: 1 },
    { id: '3', category: 'Staff', description: 'Staff qualifications', guidance: 'Review credentials and certifications', weight: 3 },
    { id: '4', category: 'Staff', description: 'Staff-to-patient ratio', guidance: 'Check if ratio meets standards', weight: 2 },
    { id: '5', category: 'Services', description: 'Range of services offered', guidance: 'Evaluate breadth of mental health services', weight: 2 },
    { id: '6', category: 'Services', description: 'Service availability', guidance: 'Check hours of operation and wait times', weight: 1 },
    { id: '7', category: 'Quality', description: 'Patient outcomes', guidance: 'Review treatment success rates', weight: 3 },
    { id: '8', category: 'Quality', description: 'Patient satisfaction', guidance: 'Check patient feedback and surveys', weight: 2 },
    { id: '9', category: 'Documentation', description: 'Record keeping', guidance: 'Assess organization and completeness of records', weight: 2 },
    { id: '10', category: 'Documentation', description: 'Privacy compliance', guidance: 'Verify adherence to privacy regulations', weight: 3 },
  ];

  // Filter criteria by current category
  const currentCriteria = auditCriteria.filter(
    criterion => criterion.category.toLowerCase() === categories[currentStep].toLowerCase()
  );
  
  // Function to calculate completion percentage for current step
  function calculateStepCompletion(step: number, ratings: Record<string, CriterionRating>): number {
    const stepCriteriaIds = auditCriteria
      .filter(c => c.category.toLowerCase() === categories[step].toLowerCase())
      .map(c => c.id);
    
    if (stepCriteriaIds.length === 0) return 0;
    
    const ratedCount = stepCriteriaIds.filter(id => 
      ratings[id] && ratings[id].rating !== 'not-rated'
    ).length;
    
    return Math.round((ratedCount / stepCriteriaIds.length) * 100);
  }

  // Map to useAuditForm equivalent functions
  const handleRatingChange = (criterionId: string, rating: Rating) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: { 
        ...prev[criterionId],
        rating, 
        notes: prev[criterionId]?.notes || '' 
      }
    }));

    // Convert rating to score
    let score = 0;
    switch (rating) {
      case 'pass': score = 100; break;
      case 'good': score = 75; break;
      case 'partial': score = 50; break;
      case 'limited': score = 25; break;
      case 'fail': score = 0; break;
      case 'not-applicable': score = 0; break;
      default: score = 0;
    }

    setCriteriaScore(Number(criterionId), score);
  };

  const handleNotesChange = (criterionId: string, notes: string) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: { 
        ...prev[criterionId],
        notes,
        rating: prev[criterionId]?.rating || 'not-rated'
      }
    }));

    const currentScore = formData.criteria.find(c => c.id === Number(criterionId))?.score || 0;
    setCriteriaScore(Number(criterionId), currentScore, notes);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      handleSubmitAudit();
    } else {
      nextStep();
    }
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
        setStep={(step) => {
          if (step >= 0 && step < categories.length) {
            // Only allow navigation to this step if previous steps are complete
            for (let i = 0; i < step; i++) {
              if (calculateStepCompletion(i, ratings) < 100) {
                return; // Don't allow navigation if previous steps aren't complete
              }
            }
            // If we get here, previous steps are complete, so we can navigate
            prevStep();
          }
        }}
      />
      
      <AuditStepContent
        step={currentStep}
        categories={categories}
        currentCriteria={currentCriteria}
        stepCompletion={stepCompletion}
        ratings={ratings}
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
        nextStep={handleNextStep}
        handleSubmitAudit={handleSubmitAudit}
        loading={isLoading}
      />
    </div>
  );
};

export default AuditForm;
