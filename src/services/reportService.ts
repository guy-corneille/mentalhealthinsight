
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
  patientGroup?: string;
}

export interface AssessmentTrendData {
  assessment_counts: Array<{
    month: string;
    initial_count: number;
    followup_count: number;
    discharge_count: number;
  }>;
  outcome_distribution: {
    significant: number;
    moderate: number;
    minimal: number;
    none: number;
    worse: number;
  };
  severity_trends: Array<{
    month: string;
    severe: number;
    moderate: number;
    mild: number;
  }>;
}

const reportService = {
  // Get assessment report data
  getAssessmentReports: async (filters: ReportFilter = {}) => {
    return await api.get<AssessmentTrendData>('/reports/assessments/', { params: filters });
  },
  
  // Get assessment completion rates
  getCompletionRates: async (filters: ReportFilter = {}) => {
    return await api.get<CompletionRateData[]>('/reports/completion-rates/', { params: filters });
  },
  
  // Get criteria distribution data
  getCriteriaDistribution: async (filters: ReportFilter = {}) => {
    return await api.get<DistributionData[]>('/reports/criteria-distribution/', { params: filters });
  },
  
  // Get audit report data
  getAuditReports: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/audits/', { params: filters });
  },
  
  // Get audit scores by category
  getAuditCategoryScores: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/audit-categories/', { params: filters });
  },
  
  // Get improvement trends data
  getImprovementTrends: async (filters: ReportFilter = {}) => {
    return await api.get<any[]>('/reports/improvement-trends/', { params: filters });
  },
  
  // Export reports to CSV
  getExportData: async (reportType: string, filters: ReportFilter = {}) => {
    return await api.get<any[]>(`/reports/export/${reportType}/`, { params: filters });
  }
};

export default reportService;
