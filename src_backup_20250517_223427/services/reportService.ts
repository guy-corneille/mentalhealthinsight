
/**
 * Report Service (Re-export)
 * 
 * This file re-exports the report service from the features directory
 * to maintain backward compatibility with existing imports.
 */
import reportService from '@/features/reports/services/reportService';
export type { 
  AssessmentReportData, 
  CompletionRateData, 
  DistributionData, 
  ReportFilter,
  AssessmentTrendData,
  AssessmentStatistics
} from '@/features/reports/services/reportService';

export default reportService;
