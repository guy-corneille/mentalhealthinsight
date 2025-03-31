
/**
 * Report Service (Re-export)
 * 
 * This file re-exports the report service from the features directory
 * to maintain backward compatibility with existing imports.
 */
import reportService, { 
  type AssessmentReportData, 
  type CompletionRateData, 
  type DistributionData, 
  type ReportFilter,
  type AssessmentTrendData,
  type AssessmentStatistics
} from '@/features/reports/services/reportService';

// Re-export the service and all its types
export type {
  AssessmentReportData, 
  CompletionRateData, 
  DistributionData, 
  ReportFilter,
  AssessmentTrendData,
  AssessmentStatistics
};

export default reportService;
