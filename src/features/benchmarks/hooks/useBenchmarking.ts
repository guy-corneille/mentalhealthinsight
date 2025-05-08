
import { useState, useEffect } from 'react';
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

// Base benchmark categories structure
const benchmarkCategories: BenchmarkCategory[] = [
  {
    id: 'operational-efficiency',
    name: 'Operational Efficiency',
    metrics: [
      {
        metricId: 'assessment-completion',
        metricName: 'Assessment Completion Rate',
        targetValue: 95,
        source: 'organizational',
        description: 'Percentage of required assessments completed on time'
      },
      {
        metricId: 'documentation-compliance',
        metricName: 'Documentation Compliance',
        targetValue: 98,
        source: 'national',
        description: 'Percentage of patient records with complete documentation'
      },
      {
        metricId: 'audit-completion',
        metricName: 'Audit Completion Rate',
        targetValue: 90,
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
        targetValue: 85,
        source: 'national',
        description: 'Average score across all audit criteria'
      },
      {
        metricId: 'compliance-rate',
        metricName: 'Compliance Rate',
        targetValue: 95,
        source: 'regulatory',
        description: 'Percentage of criteria meeting regulatory requirements'
      },
      {
        metricId: 'critical-findings',
        metricName: 'Critical Findings Rate',
        targetValue: 5,
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
        targetValue: 90,
        source: 'historical',
        description: 'Trend in audit completion rates over time'
      },
      {
        metricId: 'trend-documentation-quality',
        metricName: 'Documentation Quality Trend',
        targetValue: 85,
        source: 'historical',
        description: 'Trend in documentation quality scores over time'
      }
    ]
  }
];

export const useBenchmarking = (categoryId?: string) => {
  const [categories, setCategories] = useState<BenchmarkCategory[]>(benchmarkCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [benchmarkPerformance, setBenchmarkPerformance] = useState<BenchmarkPerformance[]>([]);
  const [benchmarkingData, setBenchmarkingData] = useState<BenchmarkingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Get real audit stats data
  const { chartData, isLoading: isAuditStatsLoading, error: auditStatsError } = useAuditStats();
  
  // Get benchmark metrics from the hook
  const { data: benchmarkMetrics, isLoading: isBenchmarkLoading, error: benchmarkError } = useBenchmarks();

  // Process and transform real data into benchmark formats
  useEffect(() => {
    const fetchBenchmarkData = async () => {
      setIsLoading(true);
      try {
        // Wait for all data sources to be ready
        if (isAuditStatsLoading || isBenchmarkLoading) return;
        
        // Handle errors from data sources
        if (auditStatsError) {
          throw auditStatsError;
        }
        
        if (benchmarkError) {
          throw benchmarkError;
        }

        // Transform the audit stats into benchmark data
        const transformedData = transformRealDataToBenchmarks(chartData);
        setBenchmarkingData(transformedData);

        // Update categories with real values where available
        const updatedCategories = [...categories];
        
        // Update Operational Efficiency metrics
        if (transformedData.operational) {
          const opCategory = updatedCategories.find(cat => cat.id === 'operational-efficiency');
          if (opCategory) {
            opCategory.metrics = opCategory.metrics.map(metric => {
              let currentValue;
              if (metric.metricId === 'assessment-completion') {
                currentValue = transformedData.operational.assessmentCompletionRate;
              } else if (metric.metricId === 'documentation-compliance') {
                currentValue = transformedData.operational.documentationCompliance;
              } else if (metric.metricId === 'audit-completion') {
                currentValue = transformedData.operational.auditCompletionRate;
              }
              
              return { ...metric, currentValue };
            });
          }
        }
        
        // Update Quality & Compliance metrics
        if (transformedData.quality) {
          const qcCategory = updatedCategories.find(cat => cat.id === 'quality-compliance');
          if (qcCategory) {
            qcCategory.metrics = qcCategory.metrics.map(metric => {
              let currentValue;
              if (metric.metricId === 'overall-audit-score') {
                currentValue = chartData?.summary?.averageScore || 0;
              } else if (metric.metricId === 'compliance-rate') {
                currentValue = transformedData.quality.complianceRate;
              } else if (metric.metricId === 'critical-findings') {
                currentValue = transformedData.quality.criticalFindingsRate;
              }
              
              return { ...metric, currentValue };
            });
          }
        }
        
        // Update Performance Trends metrics
        // Note: For trends, we're only updating the current value to show in the card
        // The actual trend data is in transformedData.trends
        if (transformedData.trends) {
          const trendCategory = updatedCategories.find(cat => cat.id === 'performance-trends');
          if (trendCategory) {
            trendCategory.metrics = trendCategory.metrics.map(metric => {
              let currentValue;
              if (metric.metricId === 'trend-audit-completion') {
                const auditCompletionTrend = transformedData.trends.find(t => t.metric === "Audit Completion");
                currentValue = auditCompletionTrend?.values[auditCompletionTrend.values.length - 1] || 0;
              } else if (metric.metricId === 'trend-documentation-quality') {
                const docQualityTrend = transformedData.trends.find(t => t.metric === "Documentation Quality");
                currentValue = docQualityTrend?.values[docQualityTrend.values.length - 1] || 0;
              }
              
              return { ...metric, currentValue };
            });
          }
        }
        
        setCategories(updatedCategories);
        
        // Calculate performance metrics based on updated categories
        const performance = updatedCategories.map(category => {
          const metrics: BenchmarkComparison[] = category.metrics.map(metric => {
            const currentValue = metric.currentValue || 0;
            
            // For metrics like critical findings, lower is better
            const isInverseMetric = metric.metricId.includes('critical-findings');
            
            // Calculate the percentage difference
            const percentDifference = isInverseMetric
              ? ((metric.targetValue - currentValue) / metric.targetValue) * 100
              : ((currentValue - metric.targetValue) / metric.targetValue) * 100;
            
            // Determine status (above/at/below benchmark)
            const status = isInverseMetric
              ? (currentValue <= metric.targetValue ? 'above' : 
                 (currentValue <= metric.targetValue * 1.1 ? 'at' : 'below'))
              : (currentValue >= metric.targetValue ? 'above' : 
                 (currentValue >= metric.targetValue * 0.9 ? 'at' : 'below'));
              
            // Add historical values for trend metrics
            let historicalValues, historicalLabels;
            
            if (category.id === 'performance-trends') {
              if (metric.metricId === 'trend-audit-completion') {
                const trendData = transformedData.trends.find(t => t.metric === "Audit Completion");
                if (trendData) {
                  historicalValues = trendData.values;
                  historicalLabels = trendData.periods;
                }
              } else if (metric.metricId === 'trend-documentation-quality') {
                const trendData = transformedData.trends.find(t => t.metric === "Documentation Quality");
                if (trendData) {
                  historicalValues = trendData.values;
                  historicalLabels = trendData.periods;
                }
              }
            }
            
            // Determine trend based on historical data if available
            let trendValue: 'improving' | 'steady' | 'declining' = 'steady';
            
            if (historicalValues && historicalValues.length > 2) {
              const recentAvg = (historicalValues[historicalValues.length - 1] + historicalValues[historicalValues.length - 2]) / 2;
              const earlierAvg = (historicalValues[0] + historicalValues[1]) / 2;
              
              if (isInverseMetric) {
                // For inverse metrics (lower is better)
                trendValue = recentAvg < earlierAvg ? 'improving' : recentAvg > earlierAvg ? 'declining' : 'steady';
              } else {
                // For standard metrics (higher is better)
                trendValue = recentAvg > earlierAvg ? 'improving' : recentAvg < earlierAvg ? 'declining' : 'steady';
              }
            }
              
            return {
              metricId: metric.metricId,
              metricName: metric.metricName,
              facilityValue: currentValue,
              benchmarkValue: metric.targetValue,
              percentDifference,
              status: status as 'above' | 'at' | 'below',
              trend: trendValue,
              historicalValues,
              historicalLabels
            };
          });
          
          // Calculate aggregate score for the category
          const totalMetrics = metrics.length;
          const metricScores = metrics.map(m => {
            if (m.status === 'above') return 3;
            if (m.status === 'at') return 2;
            return 1;
          });
          
          const aggregateScore = totalMetrics > 0
            ? (metricScores.reduce((sum, score) => sum + score, 0) / (totalMetrics * 3)) * 100
            : 0;
            
          return {
            categoryId: category.id,
            categoryName: category.name,
            aggregateScore,
            benchmarkScore: 100, // The target is always 100%
            metrics
          };
        });
        
        setBenchmarkPerformance(performance);
        setIsLoading(false);
      } catch (err) {
        console.error('Error processing benchmark data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching benchmark data'));
        setIsLoading(false);
      }
    };
    
    fetchBenchmarkData();
  }, [isAuditStatsLoading, isBenchmarkLoading, chartData, benchmarkMetrics, auditStatsError, benchmarkError]);
  
  // Get a single category's performance data
  const getCategoryPerformance = (id: string) => {
    return benchmarkPerformance.find(perf => perf.categoryId === id) || null;
  };
  
  // Get metrics that need improvement (below benchmark)
  const getImprovementAreas = () => {
    return benchmarkPerformance.flatMap(perf => 
      perf.metrics
        .filter(metric => metric.status === 'below')
        .map(metric => ({
          ...metric,
          categoryName: perf.categoryName,
          gap: Math.abs(metric.percentDifference)
        }))
    ).sort((a, b) => b.gap - a.gap);
  };
  
  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    benchmarkPerformance,
    benchmarkingData,
    isLoading: isLoading || isAuditStatsLoading || isBenchmarkLoading,
    error: error || auditStatsError || benchmarkError,
    getCategoryPerformance,
    getImprovementAreas
  };
};
