
/**
 * Report Service (Re-export)
 * 
 * This file re-exports the report service from the features directory
 * to maintain backward compatibility with existing imports.
 */
import reportService from '@/features/reports/services/reportService';
export type { 
  ReportFilter,
  AssessmentStatistics,
  AssessmentReportData, 
  CompletionRateData, 
  DistributionData,
  AssessmentTrendData
} from '@/features/reports/services/reportService';

export default reportService;
