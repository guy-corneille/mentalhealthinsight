
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
  const [categories, setCategories] = useState<BenchmarkCategory[]>(benchmarkCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [benchmarkPerformance, setBenchmarkPerformance] = useState<BenchmarkPerformance[]>([]);
  const [benchmarkingData, setBenchmarkingData] = useState<BenchmarkingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Get real audit stats data - source of truth
  const { chartData, isLoading: isAuditStatsLoading, error: auditStatsError } = useAuditStats();
  
  // Get benchmark metrics from the hook
  const { data: benchmarkMetrics, isLoading: isBenchmarkLoading, error: benchmarkError } = useBenchmarks();

  // Process and transform real data into benchmark formats
  useEffect(() => {
    const processBenchmarkData = async () => {
      setIsLoading(true);
      try {
        // Wait for data sources to be ready
        if (isAuditStatsLoading || isBenchmarkLoading) return;
        
        // Handle errors from data sources
        if (auditStatsError) {
          throw auditStatsError;
        }
        
        if (benchmarkError) {
          throw benchmarkError;
        }

        // Only proceed if we have chartData
        if (!chartData) {
          setIsLoading(false);
          return;
        }

        // Transform the audit stats into benchmark data - strict approach with no fallbacks
        const transformedData = transformRealDataToBenchmarks(chartData);
        setBenchmarkingData(transformedData);

        if (!transformedData) {
          setIsLoading(false);
          return;
        }

        // Update categories with real values where available
        const updatedCategories = [...categories];
        
        // Update Operational Efficiency metrics
        if (transformedData.operational) {
          const opCategory = updatedCategories.find(cat => cat.id === 'operational-efficiency');
          if (opCategory) {
            opCategory.metrics = opCategory.metrics.map(metric => {
              let currentValue;
              switch (metric.metricId) {
                case 'assessment-completion':
                  currentValue = transformedData.operational.assessmentCompletionRate;
                  break;
                case 'documentation-compliance':
                  currentValue = transformedData.operational.documentationCompliance;
                  break;
                case 'audit-completion':
                  currentValue = transformedData.operational.auditCompletionRate;
                  break;
                default:
                  // Do not set a currentValue if no match
                  break;
              }
              
              return currentValue !== undefined ? { ...metric, currentValue } : metric;
            });
          }
        }
        
        // Update Quality & Compliance metrics
        if (transformedData.quality) {
          const qcCategory = updatedCategories.find(cat => cat.id === 'quality-compliance');
          if (qcCategory) {
            qcCategory.metrics = qcCategory.metrics.map(metric => {
              let currentValue;
              switch (metric.metricId) {
                case 'overall-audit-score':
                  currentValue = chartData?.summary?.averageScore;
                  break;
                case 'compliance-rate':
                  currentValue = transformedData.quality.complianceRate;
                  break;
                case 'critical-findings':
                  currentValue = transformedData.quality.criticalFindingsRate;
                  break;
                default:
                  // Do not set a currentValue if no match
                  break;
              }
              
              return currentValue !== undefined ? { ...metric, currentValue } : metric;
            });
          }
        }
        
        // Update Performance Trends metrics
        if (transformedData.trends && transformedData.trends.length > 0) {
          const trendCategory = updatedCategories.find(cat => cat.id === 'performance-trends');
          if (trendCategory) {
            trendCategory.metrics = trendCategory.metrics.map(metric => {
              let currentValue;
              let trend;
              
              switch (metric.metricId) {
                case 'trend-audit-completion':
                  trend = transformedData.trends.find(t => t.metric === "Audit Completion");
                  if (trend && trend.values.length > 0) {
                    currentValue = trend.values[trend.values.length - 1];
                  }
                  break;
                case 'trend-documentation-quality':
                  trend = transformedData.trends.find(t => t.metric === "Documentation Quality");
                  if (trend && trend.values.length > 0) {
                    currentValue = trend.values[trend.values.length - 1];
                  }
                  break;
                default:
                  // Do not set a currentValue if no match
                  break;
              }
              
              return currentValue !== undefined ? { ...metric, currentValue } : metric;
            });
          }
        }
        
        setCategories(updatedCategories);
        
        // Calculate performance metrics based on updated categories
        const performance = updatedCategories.map(category => {
          const metrics: BenchmarkComparison[] = category.metrics
            // Only include metrics that have actual data
            .filter(metric => metric.currentValue !== undefined)
            .map(metric => {
              const currentValue = metric.currentValue || 0;
              
              // For metrics like critical findings, lower is better
              const isInverseMetric = metric.metricId.includes('critical-findings');
              
              // Calculate the percentage difference
              const percentDifference = isInverseMetric
                ? ((metric.targetValue - currentValue) / metric.targetValue) * 100
                : ((currentValue - metric.targetValue) / metric.targetValue) * 100;
              
              // Determine status (above/at/below benchmark)
              let status: 'above' | 'at' | 'below';
              
              if (isInverseMetric) {
                status = currentValue <= metric.targetValue ? 'above' : 
                      (currentValue <= metric.targetValue * 1.1 ? 'at' : 'below');
              } else {
                status = currentValue >= metric.targetValue ? 'above' : 
                      (currentValue >= metric.targetValue * 0.9 ? 'at' : 'below');
              }
                
              // Add historical values for trend metrics
              let historicalValues, historicalLabels;
              
              if (category.id === 'performance-trends' && transformedData.trends) {
                let relevantTrend;
                
                if (metric.metricId === 'trend-audit-completion') {
                  relevantTrend = transformedData.trends.find(t => t.metric === "Audit Completion");
                } else if (metric.metricId === 'trend-documentation-quality') {
                  relevantTrend = transformedData.trends.find(t => t.metric === "Documentation Quality");
                }
                
                if (relevantTrend) {
                  historicalValues = relevantTrend.values;
                  historicalLabels = relevantTrend.periods;
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
                status,
                trend: trendValue,
                historicalValues,
                historicalLabels
              };
            });
          
          // Calculate aggregate score for the category, but only if we have metrics
          const totalMetrics = metrics.length;
          
          // Skip score calculation if no metrics with data
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
    
    processBenchmarkData();
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
