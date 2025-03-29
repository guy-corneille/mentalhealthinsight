
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

export interface AssessmentStatistics {
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
  completionRate: number;
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
  },
  
  // Get assessment statistics (new method)
  getAssessmentStatistics: async (filters: ReportFilter = {}) => {
    try {
      // For now, we'll simulate this with the assessment trends data
      // In a real implementation, this would be a dedicated endpoint
      const trendsData = await api.get<AssessmentTrendData>('/reports/assessments/', { params: filters });
      
      // Calculate statistics from the trends data
      const assessmentCounts = trendsData.assessment_counts || [];
      const totalCount = assessmentCounts.reduce(
        (sum, month) => sum + month.initial_count + month.followup_count + month.discharge_count, 
        0
      );
      
      const countByType = {
        initial: assessmentCounts.reduce((sum, month) => sum + month.initial_count, 0),
        followup: assessmentCounts.reduce((sum, month) => sum + month.followup_count, 0),
        discharge: assessmentCounts.reduce((sum, month) => sum + month.discharge_count, 0)
      };
      
      const countByPeriod = assessmentCounts.map(month => ({
        period: month.month,
        count: month.initial_count + month.followup_count + month.discharge_count
      }));
      
      // Mock facility data for now
      const countByFacility = [
        { facilityId: '1', facilityName: 'Main Hospital', count: Math.round(totalCount * 0.4) },
        { facilityId: '2', facilityName: 'North Clinic', count: Math.round(totalCount * 0.35) },
        { facilityId: '3', facilityName: 'South Clinic', count: Math.round(totalCount * 0.25) }
      ];
      
      return {
        totalCount,
        countByFacility,
        countByType,
        countByPeriod,
        completionRate: 89 // Placeholder value
      } as AssessmentStatistics;
    } catch (error) {
      console.error('Error calculating assessment statistics:', error);
      throw error;
    }
  }
};

export default reportService;
