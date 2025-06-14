import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StepProgress from './StepProgress';
import AuditStepContent from './AuditStepContent';
import AuditStepNavigation from './AuditStepNavigation';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuditForm } from './useAuditForm';
import { 
  useAssessmentCriteria, 
  AssessmentCriteria 
} from '@/services/criteriaService';
import api from '@/services/api';
import { Rating, Criterion, CriterionRating } from './types';

const AuditForm: React.FC<{ facilityId: number; facilityName: string; auditId?: string | null }> = ({ 
  facilityId, 
  facilityName, 
  auditId 
}) => {
  const location = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [auditCriteria, setAuditCriteria] = useState<Criterion[]>([]);
  const [ratings, setRatings] = useState<Record<string, CriterionRating>>({});
  const [effectiveAuditId, setEffectiveAuditId] = useState<string | null>(null);

  // Use the criteriaService hook to fetch audit criteria
  const { data: criteriaData, isLoading: isFetchingCriteria } = useAssessmentCriteria('audit');

  // Helper function to convert AssessmentCriteria to Criterion
  const mapToCriterion = (assessmentCriteria: AssessmentCriteria): Criterion => {
    return {
      id: String(assessmentCriteria.id),
      category: assessmentCriteria.category,
      description: assessmentCriteria.description,
      guidance: assessmentCriteria.guidance || '',
      weight: assessmentCriteria.weight || 1
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        // Process criteria data from the hook
        if (criteriaData) {
          // Convert AssessmentCriteria to Criterion
          const mappedCriteria = criteriaData.map(mapToCriterion);
          setAuditCriteria(mappedCriteria);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(mappedCriteria.map(c => c.category))];
          setCategories(uniqueCategories);
        }
        
        // If we have an auditId, fetch the existing audit data
        if (auditId) {
          console.log(`Loading existing audit data for ID: ${auditId}`);
          setEffectiveAuditId(auditId);
          
          try {
            const auditResponse = await api.get(`/api/audits/${auditId}/`);
            
            // Type assertion for the audit response
            interface AuditScore {
              criteria_name: string;
              score: number;
              notes: string;
            }
            
            interface AuditResponse {
              criteria_scores: AuditScore[];
            }
            
            const typedResponse = auditResponse as AuditResponse;
            
            // If we have criteria scores, set up initial ratings
            if (typedResponse.criteria_scores) {
              const initialRatings: Record<string, CriterionRating> = {};
              
              typedResponse.criteria_scores.forEach((score) => {
                // Find matching criterion
                const criterion = criteriaData?.find(c => 
                  c.name.toLowerCase() === score.criteria_name.toLowerCase()
                );
                
                if (criterion) {
                  // Convert numeric score to rating
                  let rating: Rating = "not-rated";
                  if (score.score >= 90) rating = "pass";
                  else if (score.score >= 75) rating = "good";
                  else if (score.score >= 50) rating = "partial";
                  else if (score.score >= 25) rating = "limited";
                  else if (score.score >= 0) rating = "fail";
                  
                  initialRatings[String(criterion.id)] = {
                    rating: rating,
                    notes: score.notes || ""
                  };
                }
              });
              
              setRatings(initialRatings);
            }
            
            toast({
              title: "Audit Loaded",
              description: `Loaded existing audit data for ${facilityName}`,
            });
          } catch (error) {
            console.error("Error loading audit by ID:", error);
            toast({
              title: "Error",
              description: "Could not load the audit data",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error fetching audit data:", error);
        toast({
          title: "Error",
          description: "Failed to load audit data",
          variant: "destructive"
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [auditId, facilityName, toast, criteriaData]);

  // Calculate current criteria based on step
  const getCurrentCriteria = () => {
    if (categories.length === 0) return [];
    const currentCategory = categories[step];
    return auditCriteria.filter(c => c.category === currentCategory);
  };
  
  // Calculate completion percentage for current step
  const calculateStepCompletion = () => {
    const currentCriteria = getCurrentCriteria();
    if (currentCriteria.length === 0) return 0;
    
    let ratedCount = 0;
    currentCriteria.forEach(criterion => {
      if (ratings[criterion.id] && ratings[criterion.id].rating !== 'not-rated') {
        ratedCount++;
      }
    });
    
    return Math.round((ratedCount / currentCriteria.length) * 100);
  };
  
  // Calculate overall score based on weights
  const calculateOverallScore = () => {
    if (auditCriteria.length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    let ratedCriteriaCount = 0;
    
    auditCriteria.forEach(criterion => {
      const rating = ratings[criterion.id];
      if (rating && rating.rating !== 'not-rated') {
        let score = 0;
        switch (rating.rating) {
          case 'pass': score = 100; break;
          case 'good': score = 75; break;
          case 'partial': score = 50; break;
          case 'limited': score = 25; break;
          case 'fail': score = 0; break;
          case 'not-applicable': score = 0; break; // This is now included in the Rating type
          default: score = 0;
        }
        
        totalScore += score * criterion.weight;
        totalWeight += criterion.weight;
        ratedCriteriaCount++;
      }
    });
    
    return ratedCriteriaCount === 0 ? 0 : Math.round(totalScore / totalWeight);
  };
  
  // Handlers for updating ratings
  const handleRatingChange = (criterionId: string, rating: Rating) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...((prev[criterionId] || {}) as CriterionRating),
        rating
      }
    }));
  };
  
  const handleNotesChange = (criterionId: string, notes: string) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...((prev[criterionId] || {}) as CriterionRating),
        notes,
        rating: prev[criterionId]?.rating || 'not-rated'
      }
    }));
  };
  
  // Navigation handlers
  const nextStep = () => {
    if (step < categories.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Submit handler
  const handleSubmitAudit = async () => {
    setLoading(true);
    
    try {
      // Prepare audit data
      const criteriaScores: any[] = [];
      let overallScore = calculateOverallScore();
      
      auditCriteria.forEach(criterion => {
        if (ratings[criterion.id] && ratings[criterion.id].rating !== 'not-rated') {
          let score = 0;
          switch (ratings[criterion.id].rating) {
            case 'pass': score = 100; break;
            case 'good': score = 75; break;
            case 'partial': score = 50; break;
            case 'limited': score = 25; break;
            case 'fail': score = 0; break;
            case 'not-applicable': score = 0; break;
            default: score = 0;
          }
          
          criteriaScores.push({
            criteria_name: criterion.description || criterion.id,
            score: score,
            notes: ratings[criterion.id].notes || ''
          });
        }
      });
      
      // Prepare audit data
      const auditData = {
        facility: facilityId,
        audit_date: new Date().toISOString(),
        overall_score: overallScore,
        status: 'completed',
        notes: `Facility audit for ${facilityName}. Generated on ${new Date().toISOString().split('T')[0]}.`,
        criteria_scores: criteriaScores
      };
      
      // Submit or update the audit
      let response;
      if (effectiveAuditId) {
        console.log(`Updating existing audit with ID: ${effectiveAuditId}`, auditData);
        response = await api.put(`/api/audits/${effectiveAuditId}/`, auditData);
      } else {
        console.log(`Creating new audit for facility ID: ${facilityId}`, auditData);
        response = await api.post('/api/audits/', auditData);
      }
      
      toast({
        title: "Audit Submitted",
        description: `Audit for ${facilityName} has been successfully saved.`,
      });
      
      // Redirect to the audits list page
      window.location.href = '/audits';
      
    } catch (error) {
      console.error("Error submitting audit:", error);
      toast({
        title: "Error",
        description: "Failed to submit audit data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading || isFetchingCriteria) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" />
        <span className="ml-2">Loading audit form...</span>
      </div>
    );
  }
  
  const currentCriteria = getCurrentCriteria();
  const stepCompletion = calculateStepCompletion();
  const overallScore = calculateOverallScore();
  
  return (
    <div className="space-y-6">
      <StepProgress
        step={step}
        categories={categories}
        totalSteps={categories.length}
        setStep={setStep}
      />
      
      <AuditStepContent
        step={step}
        categories={categories}
        currentCriteria={currentCriteria}
        stepCompletion={stepCompletion}
        ratings={ratings}
        handleRatingChange={handleRatingChange}
        handleNotesChange={handleNotesChange}
      />
      
      <AuditStepNavigation
        step={step}
        totalSteps={categories.length}
        stepCompletion={stepCompletion}
        overallScore={overallScore}
        isFirstStep={step === 0}
        isLastStep={step === categories.length - 1}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmitAudit={handleSubmitAudit}
        loading={loading}
      />
    </div>
  );
};

export default AuditForm;
