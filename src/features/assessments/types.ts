export interface IndividualScore {
  name: string;
  score: number;
}

export interface CriteriaScore {
  criteria_name: string;
  score: number;
  notes?: string;
  individual_scores?: IndividualScore[];
}

export interface Audit {
  id: string;
  facility_name: string;
  auditor_name?: string;
  status: string;
  audit_date: string;
  scheduled_date?: string;
  overall_score: number;
  criteria_scores: CriteriaScore[];
  notes?: string;
} 