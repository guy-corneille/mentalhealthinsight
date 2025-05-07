
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { BenchmarkMetric } from '@/utils/benchmarkUtils';
import { analyzePerformanceGaps, calculateImprovementProjection } from '../utils/benchmarkUtils';
import { useState } from 'react';

export interface BenchmarkData {
  auditCompletion: BenchmarkMetric;
  documentationQuality: BenchmarkMetric;
  staffPerformance: BenchmarkMetric;
  patientSatisfaction: BenchmarkMetric;
}

export interface BenchmarkTarget {
  metricKey: keyof BenchmarkData;
  targetValue: number;
  targetDate: Date;
  description: string;
}

export function useBenchmarking() {
  const queryClient = useQueryClient();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Query for benchmark data
  const { 
    data: benchmarks,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['benchmarks', selectedTimeframe],
    queryFn: async (): Promise<BenchmarkData> => {
      try {
        // Fetch real audit statistics, modify the API call based on selectedTimeframe
        const auditStats = await api.get('/api/reports/audit-statistics/', {
          params: { timeframe: selectedTimeframe }
        });
        
        const completionRate = auditStats.completed / auditStats.total * 100;
        const benchmarkValue = 90; // Industry standard benchmark

        return {
          auditCompletion: {
            actualValue: completionRate,
            benchmarkValue: benchmarkValue,
            percentile: 75,
            status: completionRate >= benchmarkValue ? 'exceeds' : completionRate >= benchmarkValue * 0.9 ? 'meets' : 'below'
          },
          documentationQuality: {
            actualValue: 92,
            benchmarkValue: 85,
            percentile: 95,
            status: 'exceeds'
          },
          staffPerformance: {
            actualValue: 88,
            benchmarkValue: 85,
            percentile: 80,
            status: 'meets'
          },
          patientSatisfaction: {
            actualValue: 89,
            benchmarkValue: 90,
            percentile: 85,
            status: 'meets'
          }
        };
      } catch (error) {
        console.error("Error fetching benchmark data:", error);
        throw error;
      }
    },
  });
  
  // Get performance gaps analysis if data is available
  const performanceGaps = benchmarks ? analyzePerformanceGaps(benchmarks) : undefined;
  
  // Calculate improvement projections for a specific metric
  const calculateProjection = (metricKey: keyof BenchmarkData, targetValue: number, targetDate: Date) => {
    if (!benchmarks) return null;
    
    const currentValue = benchmarks[metricKey].actualValue;
    const daysToTarget = Math.max(1, Math.round((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    
    return calculateImprovementProjection(currentValue, targetValue, daysToTarget);
  };
  
  // Save benchmark target
  const saveBenchmarkTarget = useMutation({
    mutationFn: async (target: BenchmarkTarget) => {
      return await api.post('/api/benchmarks/targets/', target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benchmarkTargets'] });
    },
  });
  
  return {
    benchmarks,
    isLoading,
    error,
    performanceGaps,
    calculateProjection,
    saveBenchmarkTarget,
    selectedTimeframe,
    setSelectedTimeframe
  };
}
