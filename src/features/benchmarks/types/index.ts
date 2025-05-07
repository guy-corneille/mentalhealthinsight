
/**
 * Benchmark Types
 * 
 * This file contains all the type definitions related to benchmarks.
 */

export type BenchmarkSource = 'national' | 'regional' | 'organizational' | 'custom';

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
