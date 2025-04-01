
/**
 * Report Service
 * 
 * This service handles all report-related API calls.
 * It fetches various types of report data from the backend.
 */
import api from '@/services/api';

// Type definitions for reports
export type AssessmentReportData = {
  month: string;
  criteria_scores: Record<string, number>;
  average: number;
};

export type CompletionRateData = {
  month: string;
  completion_rate: number;
  target_rate: number;
};

export type DistributionData = {
  name: string;
  count: number;
  color?: string;
};

export type ReportFilter = {
  timeRange?: string;
  criteriaType?: string;
  facilityId?: string;
  startDate?: string;
  endDate?: string;
  patientGroup?: string;
};

export type AssessmentTrendData = {
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
};

export type AssessmentStatistics = {
  totalCount: number;
  countByFacility: Array<{
    facilityId: string;
    facilityName: string;
    count: number;
  }>;
  countByType: {
    initial: number;
    followup: number;
    discharge: number;
  };
  countByPeriod: Array<{
    period: string;
    count: number;
  }>;
  averageScore?: number;
  patientCoverage?: number;
  scoreByCriteria?: Array<{
    criteriaId: string;
    criteriaName: string;
    averageScore: number;
  }>;
};

const reportService = {
  // Get assessment report data
  getAssessmentReports: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<AssessmentTrendData>('/api/reports/assessments/', { params: filters });
    } catch (error) {
      console.error('Error fetching assessment reports:', error);
      throw error;
    }
  },
  
  // Get assessment completion rates
  getCompletionRates: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<CompletionRateData[]>('/api/reports/completion-rates/', { params: filters });
    } catch (error) {
      console.error('Error fetching completion rates:', error);
      throw error;
    }
  },
  
  // Get criteria distribution data
  getCriteriaDistribution: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<DistributionData[]>('/api/reports/criteria-distribution/', { params: filters });
    } catch (error) {
      console.error('Error fetching criteria distribution:', error);
      throw error;
    }
  },
  
  // Get audit report data
  getAuditReports: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/api/reports/audits/', { params: filters });
    } catch (error) {
      console.error('Error fetching audit reports:', error);
      throw error;
    }
  },
  
  // Get audit scores by category
  getAuditCategoryScores: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/api/reports/audit-categories/', { params: filters });
    } catch (error) {
      console.error('Error fetching audit category scores:', error);
      throw error;
    }
  },
  
  // Get improvement trends data
  getImprovementTrends: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/api/reports/improvement-trends/', { params: filters });
    } catch (error) {
      console.error('Error fetching improvement trends:', error);
      throw error;
    }
  },
  
  // Export reports to CSV
  getExportData: async (reportType: string, filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>(`/api/reports/export/${reportType}/`, { params: filters });
    } catch (error) {
      console.error('Error exporting report data:', error);
      throw error;
    }
  },
  
  // Get assessment statistics
  getAssessmentStatistics: async (filters: ReportFilter = {}) => {
    try {
      console.log("Fetching assessment statistics with filters:", filters);
      
      const response = await api.get<AssessmentStatistics>('/api/reports/assessment-statistics/', { 
        params: filters
      });
      
      console.log("Assessment statistics API response:", response);
      return response;
    } catch (error) {
      console.error('Error fetching assessment statistics from API:', error);
      throw error;
    }
  },
  
  // Get audit statistics
  getAuditStatistics: async (filters: ReportFilter = {}) => {
    try {
      console.log("reportService: Fetching audit statistics with filters:", filters);
      
      const response = await api.get<AssessmentStatistics>('/api/reports/audit-statistics/', { 
        params: filters
      });
      
      console.log("reportService: Received audit statistics API response:", response);
      return response;
    } catch (error) {
      console.error('reportService: Error fetching audit statistics from API:', error);
      throw error;
    }
  }
};

export default reportService;
