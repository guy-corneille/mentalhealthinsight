
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

// Generate mock assessment statistics for development
const generateMockStatistics = (filters: ReportFilter = {}): AssessmentStatistics => {
  // Generate some random but realistic-looking data
  const totalCount = 456;
  
  const countByFacility = [
    { facilityId: '1', facilityName: 'Main Hospital', count: Math.round(totalCount * 0.4) },
    { facilityId: '2', facilityName: 'North Clinic', count: Math.round(totalCount * 0.35) },
    { facilityId: '3', facilityName: 'South Clinic', count: Math.round(totalCount * 0.25) }
  ];
  
  const countByType = {
    initial: 142,
    followup: 249,
    discharge: 65
  };
  
  // Generate period data based on filters
  const countByPeriod = [];
  const now = new Date();
  const periodCount = filters.timeRange === '3months' ? 3 : 
                     filters.timeRange === '6months' ? 6 : 12;
  
  for (let i = 0; i < periodCount; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const period = date.toISOString().slice(0, 7) + "-01"; // Format YYYY-MM-01
    
    // Generate some random variation
    const baseCount = totalCount / periodCount;
    const randomVariation = Math.random() * 0.3 + 0.85; // between 0.85 and 1.15
    const count = Math.round(baseCount * randomVariation);
    
    countByPeriod.unshift({ period, count }); // Add to start to keep chronological order
  }
  
  return {
    totalCount,
    countByFacility,
    countByType,
    countByPeriod,
    completionRate: 89
  };
};

const reportService = {
  // Get assessment report data
  getAssessmentReports: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<AssessmentTrendData>('/reports/assessments/', { params: filters });
    } catch (error) {
      console.error('Error fetching assessment reports:', error);
      throw error;
    }
  },
  
  // Get assessment completion rates
  getCompletionRates: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<CompletionRateData[]>('/reports/completion-rates/', { params: filters });
    } catch (error) {
      console.error('Error fetching completion rates:', error);
      throw error;
    }
  },
  
  // Get criteria distribution data
  getCriteriaDistribution: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<DistributionData[]>('/reports/criteria-distribution/', { params: filters });
    } catch (error) {
      console.error('Error fetching criteria distribution:', error);
      throw error;
    }
  },
  
  // Get audit report data
  getAuditReports: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/reports/audits/', { params: filters });
    } catch (error) {
      console.error('Error fetching audit reports:', error);
      throw error;
    }
  },
  
  // Get audit scores by category
  getAuditCategoryScores: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/reports/audit-categories/', { params: filters });
    } catch (error) {
      console.error('Error fetching audit category scores:', error);
      throw error;
    }
  },
  
  // Get improvement trends data
  getImprovementTrends: async (filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>('/reports/improvement-trends/', { params: filters });
    } catch (error) {
      console.error('Error fetching improvement trends:', error);
      throw error;
    }
  },
  
  // Export reports to CSV
  getExportData: async (reportType: string, filters: ReportFilter = {}) => {
    try {
      return await api.get<any[]>(`/reports/export/${reportType}/`, { params: filters });
    } catch (error) {
      console.error('Error exporting report data:', error);
      throw error;
    }
  },
  
  // Get assessment statistics
  getAssessmentStatistics: async (filters: ReportFilter = {}) => {
    try {
      // Try to fetch from API
      return await api.get<AssessmentStatistics>('/reports/assessment-statistics/', { params: filters });
    } catch (error) {
      console.info('Using mock assessment statistics data');
      // If API endpoint doesn't exist, return mock data
      return generateMockStatistics(filters);
    }
  }
};

export default reportService;
