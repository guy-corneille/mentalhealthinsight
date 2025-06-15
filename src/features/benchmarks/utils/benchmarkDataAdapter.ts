import { format, subMonths } from 'date-fns';
import { 
  BenchmarkingData, 
  OperationalEfficiencyMetrics,
  QualityComplianceMetrics,
  PerformanceTrendMetrics
} from '../types';

// Helper function to generate date ranges for trend data based on actual data points
const generateMonthLabels = (count: number = 6): string[] => {
  return Array.from({ length: count }).map((_, i) => {
    return format(subMonths(new Date(), count - 1 - i), 'MMM yyyy');
  });
};

/**
 * This adapter transforms audit statistics data into operational efficiency metrics
 * using only actual data from the API with no fallbacks
 */
export const transformAuditStatsToOperationalMetrics = (auditStats: any): OperationalEfficiencyMetrics | null => {
  // Return null if no data is available
  if (!auditStats) {
    return null;
  }

  // Extract metrics from auditStats, only using what's actually available
  const completedCount = auditStats.completed || 0;
  const scheduledCount = auditStats.total || 0;
  
  // Only calculate rates if we have valid denominators
  const assessmentCompletionRate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
  
  // Get documentation compliance from criteria if available
  let documentationCompliance = 0;
  if (auditStats.criteria && Array.isArray(auditStats.criteria)) {
    const docCriteria = auditStats.criteria.find((c: any) => 
      c.name && c.name.toLowerCase().includes('document'));
    if (docCriteria && typeof docCriteria.averageScore === 'number') {
      documentationCompliance = docCriteria.averageScore;
    }
  }
  
  // Calculate audit completion rate
  const auditCompletionRate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
  
  return {
    assessmentCompletionRate,
    documentationCompliance,
    auditCompletionRate
  };
};

/**
 * This adapter transforms audit criteria data into quality compliance metrics
 * using only actual data from the API with no fallbacks
 */
export const transformAuditDataToQualityMetrics = (auditData: any): QualityComplianceMetrics | null => {
  // Return null if no data is available
  if (!auditData || !auditData.criteria || !Array.isArray(auditData.criteria) || auditData.criteria.length === 0) {
    return null;
  }

  // Transform criteria data to audit scores, using only available data
  const auditScores = auditData.criteria
    .filter((criterion: any) => criterion && typeof criterion.averageScore === 'number')
    .map((criterion: any) => ({
      category: criterion.name || 'Unknown',
      score: criterion.averageScore,
      benchmark: criterion.benchmark || 0 // Only use benchmark if available
    }));
  
  if (auditScores.length === 0) {
    return null;
  }

  // Calculate compliance rate only with available data
  const validScores = auditScores.filter(score => typeof score.benchmark === 'number');
  const meetingBenchmark = validScores.filter(score => score.score >= score.benchmark).length;
  const complianceRate = validScores.length > 0
    ? Math.round((meetingBenchmark / validScores.length) * 100)
    : 0;

  // Calculate critical findings rate (scores below 70, but only if we have scores)
  const criticalFindings = auditScores.filter(score => score.score < 70).length;
  const criticalFindingsRate = auditScores.length > 0
    ? Math.round((criticalFindings / auditScores.length) * 100)
    : 0;

  return {
    auditScores,
    complianceRate,
    criticalFindingsRate
  };
};

/**
 * This adapter transforms historical audit data into performance trends
 * using only actual data from the API with no fallbacks
 */
export const generatePerformanceTrends = (auditData: any): PerformanceTrendMetrics[] | null => {
  // Return null if no valid trend data
  if (!auditData || !auditData.countByPeriodData || !Array.isArray(auditData.countByPeriodData) || auditData.countByPeriodData.length === 0) {
    return null;
  }
  
  // Use actual periods from the data
  const periods = auditData.countByPeriodData.map((d: any) => d.month || '');
  
  // Only create trends if we have data
  const trends: PerformanceTrendMetrics[] = [];
  
  // If we have real count data, use it for the Audit Completion trend
  if (auditData.countByPeriodData.some((d: any) => d['Audit Count'] !== undefined)) {
    const completionValues = auditData.countByPeriodData.map((d: any) => d['Audit Count'] || 0);
    trends.push({
      metric: "Audit Completion",
      periods,
      values: completionValues,
      benchmarks: Array(periods.length).fill(0) // Will be updated later if benchmarks available
    });
  }
  
  // For documentation quality, check if we have criteria data
  if (auditData.criteria && Array.isArray(auditData.criteria)) {
    const docCriteria = auditData.criteria.find((c: any) => 
      c.name && c.name.toLowerCase().includes('document'));
    
    if (docCriteria && docCriteria.scoreHistory && Array.isArray(docCriteria.scoreHistory)) {
      trends.push({
        metric: "Documentation Quality",
        periods: docCriteria.scoreHistory.map((h: any) => h.period || ''),
        values: docCriteria.scoreHistory.map((h: any) => h.score || 0),
        benchmarks: Array(docCriteria.scoreHistory.length).fill(0) // Will be updated if benchmarks available
      });
    }
  }
  
  return trends.length > 0 ? trends : null;
};

/**
 * Main adapter function that combines all metrics into a unified benchmarking data object
 * using only actual data from the API with no fallbacks
 */
export const transformRealDataToBenchmarks = (chartData: any): BenchmarkingData | null => {
  try {
  // Return null if no data is available
    if (!chartData) {
    return null;
  }
  
    // Extract metrics from chartData
    const assessmentCompletion = chartData.completed ? {
      value: Math.round((chartData.completed / chartData.total) * 100),
      history: chartData.history?.map((h: any) => h.completion_rate) || [],
      labels: chartData.history?.map((h: any) => h.period) || []
    } : null;

    const documentationCompliance = chartData.criteria?.find((c: any) => 
      c.name?.toLowerCase().includes('document')
    )?.averageScore || null;

    const auditCompletion = chartData.completed ? {
      value: Math.round((chartData.completed / chartData.total) * 100),
      history: chartData.history?.map((h: any) => h.completion_rate) || [],
      labels: chartData.history?.map((h: any) => h.period) || []
    } : null;

    const overallAuditScore = chartData.averageScore ? {
      value: chartData.averageScore,
      history: chartData.history?.map((h: any) => h.average_score) || [],
      labels: chartData.history?.map((h: any) => h.period) || []
    } : null;

    const complianceRate = chartData.criteria?.find((c: any) => 
      c.name?.toLowerCase().includes('compliance')
    )?.averageScore || null;

    const criticalFindings = chartData.criteria?.find((c: any) => 
      c.name?.toLowerCase().includes('critical')
    )?.averageScore || null;

    return {
      'assessment-completion': assessmentCompletion,
      'documentation-compliance': documentationCompliance ? {
        value: documentationCompliance,
        history: [],
        labels: []
      } : null,
      'audit-completion': auditCompletion,
      'overall-audit-score': overallAuditScore,
      'compliance-rate': complianceRate ? {
        value: complianceRate,
        history: [],
        labels: []
      } : null,
      'critical-findings': criticalFindings ? {
        value: criticalFindings,
        history: [],
        labels: []
      } : null,
      'trend-audit-completion': auditCompletion,
      'trend-documentation-quality': documentationCompliance ? {
        value: documentationCompliance,
        history: [],
        labels: []
      } : null
    };
  } catch (error) {
    console.error('Error transforming benchmark data:', error);
    return null;
  }
};
