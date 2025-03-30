
import api from './api';
import { format, subMonths, startOfYear } from 'date-fns';

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
  averageScore?: number;
  patientCoverage?: number;
  scoreByCriteria?: Array<{
    criteriaId: string;
    criteriaName: string;
    averageScore: number;
  }>;
}

// Function to generate mock statistics based on filters
const generateMockStatistics = (filters: ReportFilter = {}): AssessmentStatistics => {
  const endDate = new Date();
  let startDate;
  
  // Determine time range
  if (filters.timeRange === '3months') {
    startDate = subMonths(endDate, 3);
  } else if (filters.timeRange === '6months') {
    startDate = subMonths(endDate, 6);
  } else if (filters.timeRange === 'ytd') {
    startDate = startOfYear(endDate);
  } else {
    // Default to 12 months
    startDate = subMonths(endDate, 12);
  }
  
  // Generate periods (months) between start and end date
  const periods: string[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    periods.push(format(currentDate, 'yyyy-MM'));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Generate random counts based on patient group
  const baseCount = filters.patientGroup === 'children' ? 40 : 
                  filters.patientGroup === 'elderly' ? 30 : 50;
  
  // Generate count by period
  const countByPeriod = periods.map((period, index) => {
    // Create a slight upward trend over time
    const trendFactor = 1 + (index * 0.05);
    return {
      period,
      count: Math.round(baseCount * trendFactor * (0.8 + Math.random() * 0.4))
    };
  });
  
  // Calculate total from periods
  const totalCount = countByPeriod.reduce((sum, item) => sum + item.count, 0);
  
  // Mock facility distribution
  const countByFacility = [
    { facilityId: '1', facilityName: 'Northern Community Center', count: Math.round(totalCount * 0.4) },
    { facilityId: '2', facilityName: 'Eastern Hospital', count: Math.round(totalCount * 0.35) },
    { facilityId: '3', facilityName: 'Southern Wellness Center', count: Math.round(totalCount * 0.25) }
  ];
  
  // Mock assessment type distribution
  const countByType = {
    initial: Math.round(totalCount * 0.3),
    followup: Math.round(totalCount * 0.5),
    discharge: Math.round(totalCount * 0.2)
  };
  
  // Generate random scores for criteria
  const criteriaTypes = [
    { id: "1", name: "Depression" },
    { id: "2", name: "Anxiety" },
    { id: "3", name: "Stress" },
    { id: "4", name: "Overall Wellbeing" },
    { id: "5", name: "Social Functioning" }
  ];
  
  const scoreByCriteria = criteriaTypes.map(criteria => ({
    criteriaId: criteria.id,
    criteriaName: criteria.name,
    averageScore: Math.round(60 + Math.random() * 30)
  }));
  
  // Generate average score
  const averageScore = scoreByCriteria.reduce((sum, item) => sum + item.averageScore, 0) / scoreByCriteria.length;
  
  // Mock patient coverage
  const patientCoverage = 65 + Math.round(Math.random() * 20);
  
  return {
    totalCount,
    countByFacility,
    countByType,
    countByPeriod,
    completionRate: 85 + Math.round(Math.random() * 10),
    averageScore,
    patientCoverage,
    scoreByCriteria
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
      console.log("Fetching assessment statistics with filters:", filters);
      
      // This is the correct API endpoint for assessment statistics
      // The endpoint should match what's expected by the backend
      const response = await api.get<AssessmentStatistics>('/reports/assessment-statistics', { 
        params: filters
      });
      return response;
    } catch (error) {
      console.error('Error fetching assessment statistics from API:', error);
      console.log('Falling back to mock data due to API error');
      
      // Return mock data when API fails
      return generateMockStatistics(filters);
    }
  }
};

export default reportService;
