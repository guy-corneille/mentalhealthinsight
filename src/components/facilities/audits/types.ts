
export interface Criterion {
  id: string;
  category: string;
  description: string;
  guidance: string;
  weight: number;
}

export type Rating = "pass" | "good" | "partial" | "limited" | "fail" | "not-applicable" | "not-rated";

export interface CriterionRating {
  rating: Rating;
  notes: string;
}

export interface CriterionCardProps {
  criterion: Criterion;
  rating: CriterionRating;
  onRatingChange: (criterionId: string, rating: Rating) => void;
  onNotesChange: (criterionId: string, notes: string) => void;
}

export interface AuditFormProps {
  facilityId: number;
  facilityName: string;
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
  currentCriteria: Criterion[];
  stepCompletion: number;
  ratings: Record<string, CriterionRating>;
  handleRatingChange: (criterionId: string, rating: Rating) => void;
  handleNotesChange: (criterionId: string, notes: string) => void;
}

export interface AuditStepNavigationProps {
  step?: number;
  totalSteps?: number;
  stepCompletion?: number;
  overallScore: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  prevStep: () => void;
  nextStep: () => void;
  handleSubmitAudit: () => void;
  loading: boolean;
}
