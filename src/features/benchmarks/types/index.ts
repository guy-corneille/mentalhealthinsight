/**
 * Benchmark Types
 * 
 * This file contains all the type definitions related to benchmarks.
 */

export type BenchmarkSource = 'national' | 'regional' | 'organizational' | 'custom' | 'historical' | 'regulatory';

export type BenchmarkTimeframe = 'monthly' | 'quarterly' | 'yearly';

export interface BenchmarkTarget {
  metricId: string;
  metricName: string;
  targetValue: number;
  currentValue?: number;
  source: BenchmarkSource;
  description?: string;
  lastUpdated?: string;
}

export interface BenchmarkComparison {
  metricId: string;
  metricName: string;
  facilityValue: number;
  benchmarkValue: number;
  percentDifference: number;
  status: 'above' | 'at' | 'below';
  trend?: 'improving' | 'steady' | 'declining';
  historicalValues?: number[];
  historicalLabels?: string[];
}

export interface BenchmarkCategory {
  id: string;
  name: string;
  metrics: BenchmarkTarget[];
}

export interface BenchmarkPerformance {
  categoryId: string;
  categoryName: string;
  aggregateScore: number;
  benchmarkScore: number;
  metrics: BenchmarkComparison[];
}

// Assessment status type to track completion status
export type AssessmentStatus = 'scheduled' | 'completed' | 'incomplete';

// Refined operational metrics based solely on API data
export interface OperationalEfficiencyMetrics {
  assessmentCompletionRate: number;
  documentationCompliance: number;
  auditCompletionRate: number;
}

export interface QualityComplianceMetrics {
  auditScores: {
    category: string;
    score: number;
    benchmark: number;
  }[];
  complianceRate: number;
  criticalFindingsRate: number;
}

export interface PerformanceTrendMetrics {
  metric: string;
  periods: string[];
  values: number[];
  benchmarks: number[];
}

export interface BenchmarkMetricData {
  value: number;
  history: number[];
  labels: string[];
}

export interface BenchmarkingData {
  [key: string]: BenchmarkMetricData | null;
}
