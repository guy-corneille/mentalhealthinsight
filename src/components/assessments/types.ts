
export interface Assessment {
  id: number | string;
  patient: string;
  patient_name?: string;
  facility: string | number;
  facility_name?: string;
  assessment_date: string;
  score: number;
  notes: string;
  evaluator: string;
  evaluator_name?: string;
  created_at?: string;
  updated_at?: string;
  criteria?: number;
  criteria_name?: string;
  indicator_scores?: IndicatorScore[];
}

export interface IndicatorScore {
  id: number;
  indicator: number;
  indicator_name: string;
  score: number;
  notes: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
