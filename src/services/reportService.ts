
import api from './api';

// Type definitions for reports
export interface AssessmentReportData {
  month: string;
  criteria_scores: Record<string, number>;
  average: number;
}

export interface CompletionRateData {
  month: string;
  completion_rate: number;
  target_rate: number;
}

export interface DistributionData {
  name: string;
  count: number;
  color?: string;
}

export interface ReportFilter {
  timeRange?: string;
  criteriaType?: string;
  facilityId?: string;
  startDate?: string;
  endDate?: string;
}

const reportService = {
  // Get assessment report data
  getAssessmentReports: async (filters: ReportFilter = {}) => {
    return await api.get<AssessmentReportData[]>('/reports/assessments/', filters);
  },
  
  // Get assessment completion rates
  getCompletionRates: async (filters: ReportFilter = {}) => {
    return await api.get<CompletionRateData[]>('/reports/completion-rates/', filters);
  },
  
  // Get criteria distribution data
  getCriteriaDistribution: async (filters: ReportFilter = {}) => {
    return await api.get<DistributionData[]>('/reports/criteria-distribution/', filters);
  },
  
  // Get audit report data
  getAuditReports: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/audits/', filters);
  },
  
  // Get audit scores by category
  getAuditCategoryScores: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/audit-categories/', filters);
  },
  
  // Get improvement trends data
  getImprovementTrends: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/improvement-trends/', filters);
  },
  
  // Export reports to CSV
  getExportData: async (reportType: string, filters: ReportFilter = {}) => {
    return await api.get<any[]>(`/reports/export/${reportType}/`, filters);
  }
};

export default reportService;
