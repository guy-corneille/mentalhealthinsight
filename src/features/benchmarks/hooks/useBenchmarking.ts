import { useState, useEffect, useMemo } from 'react';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';
import { useBenchmarks } from '@/hooks/useBenchmarks';
import { 
  BenchmarkCategory, 
  BenchmarkComparison, 
  BenchmarkPerformance, 
  BenchmarkTarget,
  BenchmarkingData
} from '../types';
import { 
  calculateBenchmarkStatus, 
  calculatePerformanceGap 
} from '@/utils/benchmarkUtils';
import { transformRealDataToBenchmarks } from '../utils/benchmarkDataAdapter';

// Base benchmark categories structure with targets
const benchmarkCategories: BenchmarkCategory[] = [
  {
    id: 'operational-efficiency',
    name: 'Operational Efficiency',
    metrics: [
      {
        metricId: 'assessment-completion',
        metricName: 'Assessment Completion Rate',
        targetValue: 90, // Target value
        source: 'organizational',
        description: 'Percentage of required assessments completed on time'
      },
      {
        metricId: 'documentation-compliance',
        metricName: 'Documentation Compliance',
        targetValue: 90, // Target value
        source: 'national',
        description: 'Percentage of patient records with complete documentation'
      },
      {
        metricId: 'audit-completion',
        metricName: 'Audit Completion Rate',
        targetValue: 90, // Target value
        source: 'organizational',
        description: 'Percentage of scheduled audits that were completed'
      }
    ]
  },
  {
    id: 'quality-compliance',
    name: 'Quality & Compliance',
    metrics: [
      {
        metricId: 'overall-audit-score',
        metricName: 'Overall Audit Score',
        targetValue: 80, // Target value
        source: 'national',
        description: 'Average score across all audit criteria'
      },
      {
        metricId: 'compliance-rate',
        metricName: 'Compliance Rate',
        targetValue: 90, // Target value
        source: 'regulatory',
        description: 'Percentage of criteria meeting regulatory requirements'
      },
      {
        metricId: 'critical-findings',
        metricName: 'Critical Findings Rate',
        targetValue: 10, // Target value - lower is better
        source: 'organizational',
        description: 'Percentage of audits with critical findings (lower is better)'
      }
    ]
  },
  {
    id: 'performance-trends',
    name: 'Performance Trends',
    metrics: [
      {
        metricId: 'trend-audit-completion',
        metricName: 'Audit Completion Trend',
        targetValue: 90, // Target value
        source: 'historical',
        description: 'Trend in audit completion rates over time'
      },
      {
        metricId: 'trend-documentation-quality',
        metricName: 'Documentation Quality Trend',
        targetValue: 85, // Target value
        source: 'historical',
        description: 'Trend in documentation quality scores over time'
      }
    ]
  }
];

export const useBenchmarking = (categoryId?: string) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [error, setError] = useState<Error | null>(null);

  // Get real audit stats data - source of truth
  const { chartData, isLoading: isAuditStatsLoading, error: auditStatsError } = useAuditStats();
  
  // Get benchmark metrics from the hook
  const { data: benchmarkMetrics, isLoading: isBenchmarkLoading, error: benchmarkError } = useBenchmarks();

  // Memoize the processed benchmark data
  const { categories, benchmarkPerformance, benchmarkingData } = useMemo(() => {
    try {
      if (!chartData || !benchmarkMetrics) {
        return {
          categories: benchmarkCategories,
          benchmarkPerformance: [],
          benchmarkingData: null
        };
      }

      // Transform real data into benchmark format
      const transformedData = transformRealDataToBenchmarks(chartData);

      // Update categories with actual values
      const updatedCategories = benchmarkCategories.map(category => ({
        ...category,
        metrics: category.metrics.map(metric => ({
          ...metric,
          currentValue: transformedData[metric.metricId]?.value
        }))
      }));

      // Calculate performance metrics
      const performance = updatedCategories.map(category => {
        const metrics: BenchmarkComparison[] = category.metrics
          .filter(metric => metric.currentValue !== undefined)
          .map(metric => {
            const currentValue = metric.currentValue || 0;
            const isInverseMetric = metric.metricId.includes('critical-findings');
            const percentDifference = isInverseMetric
              ? ((metric.targetValue - currentValue) / metric.targetValue) * 100
              : ((currentValue - metric.targetValue) / metric.targetValue) * 100;
            
            let status: 'above' | 'at' | 'below';
            if (isInverseMetric) {
              status = currentValue <= metric.targetValue ? 'above' : 
                    (currentValue <= metric.targetValue * 1.1 ? 'at' : 'below');
            } else {
              status = currentValue >= metric.targetValue ? 'above' : 
                    (currentValue >= metric.targetValue * 0.9 ? 'at' : 'below');
            }

            // Add historical values for trend metrics
            const historicalValues = transformedData[metric.metricId]?.history || [];
            const historicalLabels = transformedData[metric.metricId]?.labels || [];
            
            // Calculate trend direction
            let trend: 'improving' | 'steady' | 'declining' = 'steady';
            if (historicalValues.length > 1) {
              const change = historicalValues[historicalValues.length - 1] - historicalValues[0];
              trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'steady';
            }

            return {
              metricId: metric.metricId,
              metricName: metric.metricName,
              facilityValue: currentValue,
              benchmarkValue: metric.targetValue,
              percentDifference,
              status,
              trend,
              historicalValues,
              historicalLabels
            };
          });

        // Calculate aggregate score for the category
        const totalMetrics = metrics.length;
        if (totalMetrics === 0) {
          return {
            categoryId: category.id,
            categoryName: category.name,
            aggregateScore: 0,
            benchmarkScore: 100,
            metrics: []
          };
        }

        const metricScores = metrics.map(m => {
          if (m.status === 'above') return 3;
          if (m.status === 'at') return 2;
          return 1;
        });

        const aggregateScore = (metricScores.reduce((sum, score) => sum + score, 0) / (totalMetrics * 3)) * 100;

        return {
          categoryId: category.id,
          categoryName: category.name,
          aggregateScore,
          benchmarkScore: 100,
          metrics
        };
      });

      return {
        categories: updatedCategories,
        benchmarkPerformance: performance,
        benchmarkingData: transformedData
      };
    } catch (err) {
      console.error('Error processing benchmark data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching benchmark data'));
      return {
        categories: benchmarkCategories,
        benchmarkPerformance: [],
        benchmarkingData: null
      };
    }
  }, [chartData, benchmarkMetrics]);

  // Get a single category's performance data
  const getCategoryPerformance = useMemo(() => (id: string) => {
    return benchmarkPerformance.find(perf => perf.categoryId === id) || null;
  }, [benchmarkPerformance]);

  // Get metrics that need improvement (below benchmark)
  const getImprovementAreas = useMemo(() => () => {
    return benchmarkPerformance.flatMap(perf => 
      perf.metrics
        .filter(metric => metric.status === 'below')
        .map(metric => ({
          ...metric,
          categoryName: perf.categoryName,
          gap: Math.abs(metric.percentDifference)
        }))
    ).sort((a, b) => b.gap - a.gap);
  }, [benchmarkPerformance]);

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    benchmarkPerformance,
    benchmarkingData,
    isLoading: isAuditStatsLoading || isBenchmarkLoading,
    error: error || auditStatsError || benchmarkError,
    getCategoryPerformance,
    getImprovementAreas
  };
};
