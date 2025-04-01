
import api from '@/services/api';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  facilityId?: string | number;
  patientId?: string | number;
  criteriaId?: string | number;
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
    facilityId: string | number;
    facilityName: string;
    count: number;
  }>;
  countByType: {
    initial: number;
    followup: number;
    discharge: number;
  };
  scoreByCriteria: Array<{
    criteriaId: string | number;
    criteriaName: string;
    averageScore: number;
  }>;
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
  getAssessmentStatistics: async (filters?: ReportFilter) => {
    try {
      console.log('reportService: Fetching assessment statistics with filters:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);
      if (filters?.facilityId) params.append('facility', String(filters.facilityId));
      if (filters?.patientId) params.append('patient', String(filters.patientId));
      if (filters?.criteriaId) params.append('criteria', String(filters.criteriaId));
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get('/api/reports/assessment-statistics/', { params });
      return response;
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
  getAuditStatistics: async (filters?: ReportFilter) => {
    try {
      console.log('reportService: Fetching audit statistics with filters:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);
      if (filters?.facilityId) params.append('facility', String(filters.facilityId));
      
      const response = await api.get('/api/reports/audit-statistics/', { params });
      return response;
    } catch (error) {
      console.error('reportService: Error fetching audit statistics from API:', error);
      throw error;
    }
  },
};

export default reportService;
