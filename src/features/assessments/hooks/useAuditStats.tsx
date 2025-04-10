
/**
 * Audit Statistics Hook
 * 
 * This hook provides functionality to fetch and format audit statistics data.
 * It handles:
 * - Time range selection (3 months, 6 months, YTD, 12 months)
 * - Filtering by facility
 * - Data formatting for charts and summaries
 */
import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, parseISO, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import reportService, { type AssessmentStatistics } from '@/features/reports/services/reportService';

export function useAuditStats() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [facilityId, setFacilityId] = useState<string>('all');

  useEffect(() => {
    console.log("useAuditStats - Current timeRange:", timeRange);
    console.log("useAuditStats - Current facilityId:", facilityId);
  }, [timeRange, facilityId]);

  // Calculate date range based on selected time range
  const getDateRange = useCallback(() => {
    const endDate = new Date();
    let startDate;

    switch (timeRange) {
      case '3months':
        startDate = subMonths(endDate, 3);
        break;
      case '6months':
        startDate = subMonths(endDate, 6);
        break;
      case 'ytd':
        startDate = startOfYear(endDate);
        break;
      case '12months':
      default:
        startDate = subMonths(endDate, 12);
        break;
    }

    const result = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    console.log("useAuditStats - Date range calculated:", result);
    return result;
  }, [timeRange]);

  // Format chart data for display
  const formatChartData = useCallback((apiData: AssessmentStatistics) => {
    if (!apiData) {
      console.log("useAuditStats - No API data provided to format");
      return null;
    }
    
    console.log("useAuditStats - Formatting chart data from:", apiData);
    
    // Format audit counts by period for line/bar chart
    const countByPeriodData = apiData.countByPeriod.map((item) => ({
      month: format(parseISO(item.period), 'MMM yyyy'),
      'Audit Count': item.count
    }));
    
    // Format audit counts by facility for pie/bar chart
    const facilityData = apiData.countByFacility.map(facility => ({
      name: facility.facilityName,
      value: facility.count,
      color: getRandomColor(facility.facilityId)
    }));
    
    // Format audit types for pie chart - assuming audit types are mapped to criteria purposes
    const typeData = [
      { name: 'Infrastructure', value: apiData.countByType.initial || 0, color: '#10b981' },
      { name: 'Staffing', value: apiData.countByType.followup || 0, color: '#3b82f6' },
      { name: 'Treatment', value: apiData.countByType.discharge || 0, color: '#6366f1' }
    ];

    // Format average scores by criteria - make sure we handle the format safely
    const scoreByCriteriaData = apiData.scoreByCriteria?.map(item => ({
      name: item.criteriaName,
      value: item.averageScore,
      color: getRandomColor(item.criteriaId || '')
    })) || [];
    
    // Include the date range in the result for use in components
    const dateRange = getDateRange();
    
    const result = {
      countByPeriodData,
      facilityData,
      typeData,
      scoreByCriteriaData,
      dateRange,
      summary: {
        totalCount: apiData.totalCount,
        averageScore: apiData.averageScore || 0,
        completionRate: apiData.patientCoverage || 0,
        mostCommonType: getMostCommonType(apiData.countByType),
        mostActiveLocation: getMostActiveLocation(apiData.countByFacility)
      }
    };
    
    console.log("useAuditStats - Formatted chart data:", result);
    return result;
  }, [getDateRange]);
  
  // Helper functions
  const getMostCommonType = (countByType: { initial: number, followup: number, discharge: number }) => {
    const { initial, followup, discharge } = countByType;
    if (initial > followup && initial > discharge) return 'Infrastructure';
    if (followup > initial && followup > discharge) return 'Staffing';
    return 'Treatment';
  };
  
  const getMostActiveLocation = (countByFacility: Array<{ facilityId: string, facilityName: string, count: number }>) => {
    if (!countByFacility.length) return '';
    return countByFacility.reduce((max, facility) => 
      max.count > facility.count ? max : facility
    ).facilityName;
  };
  
  const getRandomColor = (id: string) => {
    const colors = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];
    const index = parseInt(id, 10) % colors.length;
    return colors[index >= 0 ? index : 0];
  };

  // Fetch audit statistics directly from API - no more fallback to dummy data
  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      // Direct API call to fetch audit statistics
      const url = '/api/reports/audit-statistics/';
      const params = {
        startDate,
        endDate,
        facilityId: facilityId !== 'all' ? facilityId : undefined
      };
      
      console.log("useAuditStats - Requesting audit stats with URL and params:", url, params);
      
      const response = await api.get<AssessmentStatistics>(url, { params });
      console.log("useAuditStats - Received API response:", response);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from API');
      }
      
      return response as AssessmentStatistics;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const chartData = apiData ? formatChartData(apiData) : null;

  return {
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    isLoading,
    error,
    chartData
  };
}
