
import { BenchmarkMetric, calculateBenchmarkStatus } from "@/utils/benchmarkUtils";

/**
 * Calculates performance gaps between actual values and benchmarks
 * @param metrics Collection of benchmark metrics to analyze
 * @returns Object with performance gaps and improvement recommendations
 */
export const analyzePerformanceGaps = (metrics: Record<string, BenchmarkMetric>) => {
  const gaps: Record<string, { 
    gap: number, 
    priority: 'low' | 'medium' | 'high',
    recommendation: string 
  }> = {};
  
  Object.entries(metrics).forEach(([key, metric]) => {
    // Calculate the gap as a percentage
    const gap = ((metric.benchmarkValue - metric.actualValue) / metric.benchmarkValue) * 100;
    
    // Determine priority based on gap size
    let priority: 'low' | 'medium' | 'high' = 'low';
    if (gap > 15) priority = 'high';
    else if (gap > 5) priority = 'medium';
    
    // Generate recommendation based on category
    let recommendation = '';
    switch (key) {
      case 'auditCompletion':
        recommendation = gap > 0 
          ? 'Increase audit completion rate by implementing automated reminders and scheduling tools.' 
          : 'Maintain current audit completion processes while monitoring for quality.';
        break;
      case 'documentationQuality':
        recommendation = gap > 0 
          ? 'Improve documentation completeness through staff training and standardized templates.' 
          : 'Sustain documentation quality while seeking opportunities for process efficiency.';
        break;
      case 'staffPerformance':
        recommendation = gap > 0 
          ? 'Address staff performance gaps through targeted training and improved supervision.' 
          : 'Continue staff development activities while celebrating performance achievements.';
        break;
      case 'patientSatisfaction':
        recommendation = gap > 0 
          ? 'Enhance patient experience through service improvements based on feedback analysis.' 
          : 'Maintain high patient satisfaction while collecting more granular feedback data.';
        break;
      default:
        recommendation = 'Analyze underlying factors and develop targeted improvement strategies.';
    }
    
    gaps[key] = { gap: Math.abs(gap), priority, recommendation };
  });
  
  return gaps;
};

/**
 * Calculates projected improvement based on current performance and target dates
 * @param current Current performance value
 * @param target Target performance value
 * @param daysToTarget Number of days to reach target
 * @returns Improvement projection data including milestones
 */
export const calculateImprovementProjection = (
  current: number,
  target: number,
  daysToTarget: number
) => {
  const totalImprovement = target - current;
  const dailyImprovement = totalImprovement / daysToTarget;
  
  // Calculate milestones (30-day intervals)
  const milestones = [];
  const intervalDays = 30;
  const intervals = Math.ceil(daysToTarget / intervalDays);
  
  for (let i = 1; i <= intervals; i++) {
    const days = Math.min(i * intervalDays, daysToTarget);
    const projectedValue = current + (dailyImprovement * days);
    
    milestones.push({
      day: days,
      value: Number(projectedValue.toFixed(1)),
      percentComplete: Math.min(100, Math.round((days / daysToTarget) * 100))
    });
  }
  
  return {
    current,
    target,
    daysToTarget,
    dailyImprovement,
    milestones
  };
};
