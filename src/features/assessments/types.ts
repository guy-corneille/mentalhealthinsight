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

export interface IndicatorScore {
  id: string;
  indicator_name: string;
  score: number;
}

export interface Assessment {
  id: string;
  patient: string;
  patient_name?: string;
  facility: string | number;
  facility_name?: string;
  evaluator?: string;
  evaluator_name?: string;
  status: 'scheduled' | 'completed' | 'missed';
  scheduled_date?: string;
  assessment_date?: string;
  score: number;
  notes?: string;
  missed_reason?: string;
  criteria_name?: string;
  indicator_scores?: IndicatorScore[];
}

export interface Audit {
  id: string;
  facility: number;
  facility_name: string;
  auditor?: string;
  auditor_name?: string;
  status: 'scheduled' | 'completed' | 'missed';
  audit_date?: string;
  scheduled_date: string;
  overall_score: number;
  criteria_scores: CriteriaScore[];
  notes?: string;
  missed_reason?: string;
}

export interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
} 