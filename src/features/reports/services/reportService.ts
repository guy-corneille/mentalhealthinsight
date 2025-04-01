
import api from '@/services/api';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  facilityId?: string;
  patientId?: string;
  criteriaId?: string;
  status?: string;
}

export interface AssessmentStatistics {
  totalCount: number;
  averageScore: number;
  patientCoverage: number;
  countByPeriod: Array<{
    period: string;
    count: number;
  }>;
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
  scoreByCriteria: Array<{
    criteriaId: string;
    criteriaName: string;
    averageScore: number;
  }>;
}

// Additional types needed for exports
export interface AssessmentReportData {
  id: string;
  title: string;
  date: string;
  type: string;
  data: any;
}

export interface CompletionRateData {
  period: string;
  rate: number;
}

export interface DistributionData {
  name: string;
  value: number;
}

export interface AssessmentTrendData {
  period: string;
  count: number;
}

/**
 * Service for generating and retrieving reports
 */
const reportService = {
  /**
   * Generate a new report based on the provided parameters
   * @param reportData Report generation parameters
   * @returns Promise with the generated report data
   */
  generateReport: async (reportData: any) => {
    try {
      console.log('Generating report with data:', reportData);
      const response = await api.post('/api/reports/generate/', reportData);
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  /**
   * Get assessment statistics
   * @param filters Optional filters for the statistics
   * @returns Promise with assessment statistics
   */
  getAssessmentStatistics: async (filters?: ReportFilter): Promise<AssessmentStatistics> => {
    try {
      console.log('reportService: Fetching assessment statistics with filters:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);
      if (filters?.facilityId) params.append('facility', filters.facilityId);
      if (filters?.patientId) params.append('patient', filters.patientId);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get<AssessmentStatistics>('/api/reports/assessment-statistics/', { params });
      
      // Ensure all numeric IDs are converted to strings for type safety
      const formattedResponse: AssessmentStatistics = {
        ...response,
        countByFacility: response.countByFacility.map(facility => ({
          ...facility,
          facilityId: String(facility.facilityId)
        })),
        scoreByCriteria: response.scoreByCriteria.map(criteria => ({
          ...criteria,
          criteriaId: String(criteria.criteriaId)
        }))
      };
      
      return formattedResponse;
    } catch (error) {
      console.error('reportService: Error fetching assessment statistics from API:', error);
      throw error;
    }
  },

  /**
   * Get audit statistics
   * @param filters Optional filters for the statistics
   * @returns Promise with audit statistics
   */
  getAuditStatistics: async (filters?: ReportFilter): Promise<AssessmentStatistics> => {
    try {
      console.log('reportService: Fetching audit statistics with filters:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);
      if (filters?.facilityId) params.append('facility', filters.facilityId);
      // Don't include criteria_id as it's not needed in this context
      
      const response = await api.get<AssessmentStatistics>('/api/reports/audit-statistics/', { params });
      
      // Ensure all numeric IDs are converted to strings for type safety
      const formattedResponse: AssessmentStatistics = {
        ...response,
        countByFacility: response.countByFacility.map(facility => ({
          ...facility,
          facilityId: String(facility.facilityId)
        })),
        scoreByCriteria: response.scoreByCriteria.map(criteria => ({
          ...criteria,
          criteriaId: String(criteria.criteriaId)
        }))
      };
      
      return formattedResponse;
    } catch (error) {
      console.error('reportService: Error fetching audit statistics from API:', error);
      throw error;
    }
  },

  /**
   * Get assessment reports
   * @returns Promise with assessment reports list
   */
  getAssessmentReports: async (): Promise<AssessmentReportData[]> => {
    try {
      const response = await api.get<AssessmentReportData[]>('/api/reports/assessments/');
      return response;
    } catch (error) {
      console.error('reportService: Error fetching assessment reports:', error);
      throw error;
    }
  },

  /**
   * Get audit reports
   * @returns Promise with audit reports list
   */
  getAuditReports: async (): Promise<AssessmentReportData[]> => {
    try {
      const response = await api.get<AssessmentReportData[]>('/api/reports/audits/');
      return response;
    } catch (error) {
      console.error('reportService: Error fetching audit reports:', error);
      throw error;
    }
  },
};

export default reportService;
