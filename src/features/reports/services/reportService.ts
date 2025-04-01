/**
 * Report Service
 * 
 * This service handles all report-related API calls.
 * It fetches various types of report data from the backend.
 * If API calls fail, it falls back to generating mock data.
 */
import api from '@/services/api';
import { format, subMonths, startOfYear } from 'date-fns';

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

/**
 * Generate mock statistics when API is unavailable
 * This keeps the application functional even when backend is down
 */
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
    averageScore,
    patientCoverage,
    scoreByCriteria
  };
};

/**
 * Generate mock audit statistics when API is unavailable
 * This keeps the application functional even when backend is down
 */
const generateMockAuditStatistics = (filters: ReportFilter = {}): AssessmentStatistics => {
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
  
  // Generate random counts
  const baseCount = 5;
  
  // Generate count by period
  const countByPeriod = periods.map((period, index) => {
    // Create a slight upward trend over time
    const trendFactor = 1 + (index * 0.08);
    return {
      period,
      count: Math.round(baseCount * trendFactor * (0.8 + Math.random() * 0.4))
    };
  });
  
  // Calculate total from periods
  const totalCount = countByPeriod.reduce((sum, item) => sum + item.count, 0);
  
  // Mock facility distribution
  const countByFacility = [
    { facilityId: '1', facilityName: 'Central Hospital', count: Math.round(totalCount * 0.3) },
    { facilityId: '2', facilityName: 'Eastern District Clinic', count: Math.round(totalCount * 0.25) },
    { facilityId: '3', facilityName: 'Northern Community Center', count: Math.round(totalCount * 0.2) },
    { facilityId: '4', facilityName: 'Southern District Hospital', count: Math.round(totalCount * 0.25) }
  ];
  
  // Mock audit type distribution (using the same structure as assessments but with audit-specific names)
  const countByType = {
    initial: Math.round(totalCount * 0.4), // Infrastructure audits
    followup: Math.round(totalCount * 0.35), // Staffing audits
    discharge: Math.round(totalCount * 0.25) // Treatment audits
  };
  
  // Generate random scores for criteria
  const criteriaTypes = [
    { id: "1", name: "Infrastructure & Safety" },
    { id: "2", name: "Staffing & Training" },
    { id: "3", name: "Treatment & Care" },
    { id: "4", name: "Patient Rights" },
    { id: "5", name: "Documentation" }
  ];
  
  const scoreByCriteria = criteriaTypes.map(criteria => ({
    criteriaId: criteria.id,
    criteriaName: criteria.name,
    averageScore: Math.round(65 + Math.random() * 25)
  }));
  
  // Generate average score
  const averageScore = scoreByCriteria.reduce((sum, item) => sum + item.averageScore, 0) / scoreByCriteria.length;
  
  // Mock completion rate
  const patientCoverage = 70 + Math.round(Math.random() * 20);
  
  return {
    totalCount,
    countByFacility,
    countByType,
    countByPeriod,
    averageScore,
    patientCoverage,
    scoreByCriteria
  };
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
      
      // Update the URL path to match the Django URL pattern with explicit url_path
      return await api.get<AssessmentStatistics>('/api/reports/assessment-statistics/', { 
        params: filters
      });
    } catch (error) {
      console.error('Error fetching assessment statistics from API:', error);
      console.log('Falling back to mock data due to API error');
      
      // Return mock data when API fails, without showing any notification
      return generateMockStatistics(filters);
    }
  },

  // Get audit statistics
  getAuditStatistics: async (filters: ReportFilter = {}) => {
    try {
      console.log("Fetching audit statistics with filters:", filters);
      
      // Use the real API endpoint
      return await api.get<AssessmentStatistics>('/api/reports/audit-statistics/', { 
        params: filters
      });
    } catch (error) {
      console.error('Error fetching audit statistics from API:', error);
      console.log('Falling back to mock data due to API error');
      
      // Return mock data when API fails, without showing any notification
      return generateMockAuditStatistics(filters);
    }
  }
};

export default reportService;
