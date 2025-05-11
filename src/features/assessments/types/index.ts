
/**
 * Assessment Types
 * 
 * This file contains all the type definitions related to assessments.
 * These types are used across multiple assessment-related components.
 */

export interface Assessment {
  id: number | string;
  patient: string;
  patient_name?: string;
  facility: string | number;
  facility_name?: string;
  assessment_date: string;
  scheduled_date?: string;
  score: number;
  status: 'scheduled' | 'completed' | 'incomplete';
  incomplete_reason?: string;
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

// Assessment status type to track completion status
export type AssessmentStatus = 'scheduled' | 'completed' | 'incomplete';

// Audit related types
export interface Audit {
  id: string;
  facility: number;
  facility_name: string;
  audit_date: string;
  overall_score: number;
  status: 'scheduled' | 'completed' | 'incomplete';
  notes: string;
  auditor_name?: string;
  auditor?: string;
  scheduled_date?: string;
}

export interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}
