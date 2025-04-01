
export type Rating = "pass" | "good" | "partial" | "limited" | "fail" | "not-applicable" | "not-rated";

export interface CriteriaRating {
  rating: Rating;
  notes: string;
}

export interface AuditCriterion {
  id: string;
  category: string;
  description: string;
  guidance: string;
  weight: number;
}

export type CriteriaRatings = Record<string, CriteriaRating>;

export interface AuditFormProps {
  facilityId: number;
  facilityName: string;
}

export interface CriterionCardProps {
  criterion: AuditCriterion;
  rating: CriteriaRating;
  onRatingChange: (criterionId: string, rating: Rating) => void;
  onNotesChange: (criterionId: string, notes: string) => void;
}

export interface AuditStepNavigationProps {
  step: number;
  totalSteps: number;
  stepCompletion: number;
  overallScore: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  prevStep: () => void;
  nextStep: () => void;
  handleSubmitAudit: () => void;
  loading: boolean;
}

export interface StepProgressProps {
  step: number;
  categories: string[];
  totalSteps: number;
  setStep: (step: number) => void;
}

export interface AuditStepContentProps {
  step: number;
  categories: string[];
  currentCriteria: AuditCriterion[];
  stepCompletion: number;
  ratings: CriteriaRatings;
  handleRatingChange: (criterionId: string, rating: Rating) => void;
  handleNotesChange: (criterionId: string, notes: string) => void;
}
