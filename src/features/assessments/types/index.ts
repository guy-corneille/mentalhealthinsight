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
  status?: 'scheduled' | 'completed' | 'missed';
  score: number;
  notes: string;
  evaluator: string;
  evaluator_name?: string;
  created_at?: string;
  updated_at?: string;
  criteria?: number;
  criteria_name?: string;
  indicator_scores?: IndicatorScore[];
  missed_reason?: string;
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

// Audit related types
export interface Audit {
  id: string;
  facility: number;
  facility_name: string;
  auditor: string;
  auditor_name: string;
  audit_date: string;
  scheduled_date: string;
  overall_score: number;
  status: 'scheduled' | 'completed' | 'missed';
  missed_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  criteria_scores?: Array<{
    criteria_name: string;
    score: number;
    notes?: string;
  }>;
}

export interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}
