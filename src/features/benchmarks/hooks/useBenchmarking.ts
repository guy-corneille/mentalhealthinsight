
import { useState, useEffect } from 'react';
import { BenchmarkCategory, BenchmarkComparison, BenchmarkPerformance, BenchmarkTarget } from '../types';
import { calculateBenchmarkStatus, calculatePerformanceGap } from '@/utils/benchmarkUtils';

// Sample benchmark data (would come from API in a real app)
const sampleBenchmarkCategories: BenchmarkCategory[] = [
  {
    id: 'clinical-outcomes',
    name: 'Clinical Outcomes',
    metrics: [
      {
        metricId: 'symptom-reduction',
        metricName: 'Symptom Reduction Rate',
        targetValue: 75,
        currentValue: 68,
        source: 'national',
        description: 'Percentage of patients showing significant symptom reduction after treatment'
      },
      {
        metricId: 'readmission-rate',
        metricName: 'Readmission Rate',
        targetValue: 12,
        currentValue: 18,
        source: 'regional',
        description: 'Percentage of patients readmitted within 30 days'
      },
      {
        metricId: 'treatment-completion',
        metricName: 'Treatment Completion Rate',
        targetValue: 85,
        currentValue: 79,
        source: 'organizational',
        description: 'Percentage of patients who complete their treatment plan'
      }
    ]
  },
  {
    id: 'operational-efficiency',
    name: 'Operational Efficiency',
    metrics: [
      {
        metricId: 'assessment-completion',
        metricName: 'Assessment Completion Rate',
        targetValue: 95,
        currentValue: 92,
        source: 'organizational',
        description: 'Percentage of required assessments completed on time'
      },
      {
        metricId: 'documentation-compliance',
        metricName: 'Documentation Compliance',
        targetValue: 98,
        currentValue: 94,
        source: 'national',
        description: 'Percentage of patient records with complete documentation'
      }
    ]
  },
  {
    id: 'patient-experience',
    name: 'Patient Experience',
    metrics: [
      {
        metricId: 'satisfaction-score',
        metricName: 'Patient Satisfaction Score',
        targetValue: 85,
        currentValue: 82,
        source: 'national',
        description: 'Average satisfaction score from patient surveys (0-100)'
      },
      {
        metricId: 'wait-time',
        metricName: 'Average Wait Time',
        targetValue: 15,
        currentValue: 22,
        source: 'regional',
        description: 'Average wait time for initial appointment (days)'
      }
    ]
  }
];

export const useBenchmarking = (categoryId?: string) => {
  const [categories, setCategories] = useState<BenchmarkCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [benchmarkPerformance, setBenchmarkPerformance] = useState<BenchmarkPerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch benchmark data (simulated)
  useEffect(() => {
    const fetchBenchmarkData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        setCategories(sampleBenchmarkCategories);
        
        // Calculate performance metrics
        const performance = sampleBenchmarkCategories.map(category => {
          const metrics: BenchmarkComparison[] = category.metrics.map(metric => {
            const currentValue = metric.currentValue || 0;
            
            // For metrics like wait time or readmission rate, lower is better
            const isInverseMetric = metric.metricId.includes('wait-time') || 
                                    metric.metricId.includes('readmission');
            
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
              
            return {
              metricId: metric.metricId,
              metricName: metric.metricName,
              facilityValue: currentValue,
              benchmarkValue: metric.targetValue,
              percentDifference,
              status: status as 'above' | 'at' | 'below',
              trend: Math.random() > 0.6 ? 'improving' : 
                     Math.random() > 0.3 ? 'steady' : 'declining'
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
        console.error('Error fetching benchmark data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching benchmark data'));
        setIsLoading(false);
      }
    };
    
    fetchBenchmarkData();
  }, []);
  
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
    isLoading,
    error,
    getCategoryPerformance,
    getImprovementAreas
  };
};
