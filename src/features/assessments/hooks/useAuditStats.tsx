
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
import reportService from '@/features/reports/services/reportService';

// Define the actual audit data structure based on API response
type AuditData = {
  audit_id: string;
  criteria_name: string;
  score: number;
  notes?: string;
};

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
  const formatChartData = useCallback((apiData: AuditData[]) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("useAuditStats - No API data provided to format");
      return null;
    }
    
    console.log("useAuditStats - Formatting chart data from:", apiData);
    
    // Group audits by month
    const countByPeriod = apiData.reduce((acc: any[], audit) => {
      const month = format(new Date(audit.audit_id.split('-')[0]), 'MMM yyyy');
      const existingMonth = acc.find(item => item.period === month);
      if (existingMonth) {
        existingMonth.count++;
      } else {
        acc.push({ period: month, count: 1 });
      }
      return acc;
    }, []);
    
    // Format period data
    const countByPeriodData = countByPeriod.map(item => ({
      month: item.period,
      'Audit Count': item.count
    }));
    
    // Group by criteria name for scores
    const criteriaScores = apiData.reduce((acc: any, audit) => {
      if (!acc[audit.criteria_name]) {
        acc[audit.criteria_name] = {
          scores: [],
          count: 0
        };
      }
      acc[audit.criteria_name].scores.push(audit.score);
      acc[audit.criteria_name].count++;
      return acc;
    }, {});
    
    // Calculate averages and prepare criteria data
    const scoreByCriteriaData = Object.entries(criteriaScores).map(([name, data]: [string, any]) => ({
      name,
      value: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
      color: getRandomColor(name)
    }));
    
    // Calculate type distribution (using criteria names as types)
    const typeGroups = apiData.reduce((acc: any, audit) => {
      const type = audit.criteria_name.split(' ')[0]; // Use first word of criteria as type
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const typeData = Object.entries(typeGroups).map(([type, count]) => ({
      name: type,
      value: count as number,
      color: getRandomColor(type)
    }));
    
    // Include the date range in the result
    const dateRange = getDateRange();
    
    const result = {
      countByPeriodData,
      facilityData: [], // This will be populated when facility data is available
      typeData,
      scoreByCriteriaData,
      dateRange,
      summary: {
        totalCount: apiData.length,
        averageScore: Math.round(apiData.reduce((sum, audit) => sum + audit.score, 0) / apiData.length),
        completionRate: 100, // This will need to be calculated differently if we have completion status
        mostCommonType: typeData.reduce((max, type) => type.value > max.value ? type : max).name,
        mostActiveLocation: 'All Facilities' // This will need facility data to be meaningful
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

  // Fetch audit statistics from API
  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      const params = {
        startDate,
        endDate,
        facilityId: facilityId !== 'all' ? facilityId : undefined
      };
      
      console.log("useAuditStats - Requesting audit stats with params:", params);
      
      const response = await api.get<AuditData[]>('/api/reports/audit-statistics/', { params });
      console.log("useAuditStats - Received API response:", response);
      
      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response from API');
      }
      
      return response;
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
