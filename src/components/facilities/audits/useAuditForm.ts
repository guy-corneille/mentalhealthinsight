
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import { 
  Rating, 
  AuditCriterion, 
  CriteriaRatings 
} from './types';

// Define the audit criteria structure
const auditCriteria: AuditCriterion[][] = [
  // Infrastructure and Safety
  [
    {
      id: "inf-1",
      category: "Infrastructure",
      description: "Facility has adequate physical space for patient care",
      guidance: "Examine if rooms, corridors, and common areas meet size standards for mental health facilities",
      weight: 3
    },
    {
      id: "inf-2",
      category: "Infrastructure",
      description: "Safety features are in place for patient protection",
      guidance: "Check for secured windows, anti-ligature fixtures, emergency call systems",
      weight: 5
    },
    {
      id: "inf-3",
      category: "Infrastructure",
      description: "Accessibility accommodations for persons with disabilities",
      guidance: "Verify ramps, handrails, accessible restrooms, and other accessibility features",
      weight: 4
    },
    {
      id: "inf-4",
      category: "Infrastructure",
      description: "Appropriate separation of high-risk and lower-risk patients",
      guidance: "Evaluate physical layout for proper patient separation based on acuity levels",
      weight: 4
    }
  ],
  // Staffing and Training
  [
    {
      id: "staff-1",
      category: "Staffing",
      description: "Adequate staffing ratios for patient population",
      guidance: "Review staff schedules and patient census, compare to recommended ratios",
      weight: 5
    },
    {
      id: "staff-2",
      category: "Staffing",
      description: "Staff have appropriate qualifications and licensing",
      guidance: "Check credentials for clinical staff against regulatory requirements",
      weight: 5
    },
    {
      id: "staff-3",
      category: "Staffing",
      description: "Regular training on crisis management and de-escalation",
      guidance: "Review training records for frequency and comprehensiveness",
      weight: 4
    },
    {
      id: "staff-4",
      category: "Staffing",
      description: "Staff receive suicide prevention and assessment training",
      guidance: "Verify training records and knowledge through staff interviews",
      weight: 5
    }
  ],
  // Treatment and Care
  [
    {
      id: "care-1",
      category: "Treatment",
      description: "Individualized treatment plans for all patients",
      guidance: "Review sample of patient charts for comprehensive treatment planning",
      weight: 4
    },
    {
      id: "care-2",
      category: "Treatment",
      description: "Evidence-based therapeutic interventions",
      guidance: "Observe therapy sessions, review documentation of interventions",
      weight: 4
    },
    {
      id: "care-3",
      category: "Treatment",
      description: "Appropriate medication management protocols",
      guidance: "Review medication administration records and prescribing practices",
      weight: 5
    },
    {
      id: "care-4",
      category: "Treatment",
      description: "Discharge planning begins at admission",
      guidance: "Verify discharge planning documentation in patient records",
      weight: 3
    }
  ],
  // Rights and Dignity
  [
    {
      id: "rights-1",
      category: "Rights",
      description: "Patient rights are clearly communicated",
      guidance: "Check for posted rights information, admission materials",
      weight: 3
    },
    {
      id: "rights-2",
      category: "Rights",
      description: "Complaint/grievance process is accessible to patients",
      guidance: "Review complaint process documentation and resolution records",
      weight: 3
    },
    {
      id: "rights-3",
      category: "Rights",
      description: "Privacy and confidentiality practices meet standards",
      guidance: "Observe patient interactions, review information sharing protocols",
      weight: 4
    },
    {
      id: "rights-4",
      category: "Rights",
      description: "Procedures for informed consent are followed",
      guidance: "Review consent forms and documentation of consent process",
      weight: 4
    }
  ]
];

const categories = ["Infrastructure & Safety", "Staffing & Training", "Treatment & Care", "Rights & Dignity"];

export const useAuditForm = (facilityId: number, facilityName: string) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<CriteriaRatings>({});
  const [loading, setLoading] = useState(false);

  // Updated rating utilities to match new rating options
  const getRatingValue = (rating: Rating): number => {
    switch (rating) {
      case "pass": return 1.0;   // 100%
      case "good": return 0.75;  // 75%
      case "partial": return 0.5; // 50%
      case "limited": return 0.25; // 25%
      case "fail": return 0;     // 0%
      case "not-applicable": return 0; // N/A
      default: return 0;
    }
  };

  // Calculate completion rate for current step
  const getStepCompletionRate = (): number => {
    const currentCriteria = auditCriteria[step];
    let ratedCount = 0;
    
    currentCriteria.forEach(criterion => {
      if (ratings[criterion.id]?.rating && ratings[criterion.id].rating !== "not-rated") {
        ratedCount++;
      }
    });
    
    return (ratedCount / currentCriteria.length) * 100;
  };

  // Calculate overall score
  const calculateScore = (): number => {
    let totalScore = 0;
    let totalWeight = 0;
    
    auditCriteria.flat().forEach(criterion => {
      if (ratings[criterion.id]?.rating) {
        if (ratings[criterion.id].rating === "not-applicable") {
          return;
        }
        
        totalScore += getRatingValue(ratings[criterion.id].rating) * criterion.weight;
        totalWeight += criterion.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  };

  // Handler for rating a criterion
  const handleRatingChange = (criterionId: string, rating: Rating) => {
    console.log(`Rating changed for criterion ${criterionId} to ${rating}`);
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        rating
      }
    }));
  };

  // Handler for updating notes
  const handleNotesChange = (criterionId: string, notes: string) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId] || { rating: "not-rated" },
        notes
      }
    }));
  };

  // Handler for submitting the audit
  const handleSubmitAudit = async () => {
    console.log("Submitting audit with ratings:", ratings);
    setLoading(true);
    
    try {
      const score = calculateScore();
      
      // Create criteria scores
      const criteriaScores = Object.keys(ratings).map(criterionId => {
        const rating = ratings[criterionId];
        const criterion = auditCriteria.flat().find(c => c.id === criterionId);
        
        return {
          criteria_name: criterion?.description || criterionId,
          score: rating.rating === "not-applicable" ? null : getRatingValue(rating.rating) * 100,
          notes: rating.notes || ""
        };
      });
      
      // Create audit data matching backend expectations
      const auditData = {
        facility: facilityId,
        overall_score: score,
        audit_date: new Date().toISOString().split('T')[0],
        status: "completed",
        notes: "Facility audit completed",
        criteria_scores: criteriaScores
      };
      
      console.log("Sending audit data to API:", auditData);
      
      // POST to the audits endpoint based on Django API
      const response = await api.post('/api/audits/', auditData);
      console.log("Audit submission response:", response);
      
      // Update facility's last inspection date
      await api.patch(`/api/facilities/${facilityId}/`, {
        last_inspection_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Audit Completed",
        description: `Facility audit for ${facilityName} completed with a score of ${score}%.`,
      });
      
      window.location.href = `/facilities/${facilityId}`;
      
    } catch (error) {
      console.error("Error submitting audit:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting the audit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigate to next/previous step
  const nextStep = () => {
    if (step < auditCriteria.length - 1) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const isLastStep = step === auditCriteria.length - 1;
  const isFirstStep = step === 0;
  const stepCompletion = getStepCompletionRate();
  const overallScore = calculateScore();

  return {
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
  };
};
