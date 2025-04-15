
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Type definitions for audit stats
interface AuditSummary {
  totalCount: number;
  averageScore?: number;
}

interface FacilityStat {
  facilityName: string;
  count: number;
}

interface CriteriaStat {
  name: string;
  averageScore: number;
}

interface AuditStatsResponse {
  summary: AuditSummary;
  facilities: FacilityStat[];
  criteria: CriteriaStat[];
}

export function useAuditStats() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [facilityId, setFacilityId] = useState<string>('all');

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

    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  }, [timeRange]);

  // Format chart data from API response
  const formatChartData = useCallback((apiData: AuditStatsResponse) => {
    if (!apiData) {
      console.log("No audit stats data available to format");
      return null;
    }
    
    // Prepare period data for chart (if available)
    const countByPeriodData = (apiData.facilities || []).map(facility => ({
      month: facility.facilityName,
      'Audit Count': facility.count
    }));

    return {
      summary: apiData.summary,
      facilities: apiData.facilities,
      criteria: apiData.criteria,
      countByPeriodData
    };
  }, []);

  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      const params = {
        startDate,
        endDate,
        ...(facilityId !== 'all' && { facilityId })
      };
      
      console.log("Requesting audit stats with params:", params);
      
      try {
        // The endpoint path must match what we have in the backend
        const response = await api.get<AuditStatsResponse>('/api/reports/audit-statistics/', { params });
        return response;
      } catch (error) {
        console.error("Error fetching audit statistics:", error);
        toast({
          title: "Error loading audit data",
          description: "Could not retrieve audit statistics from the server",
          variant: "destructive",
        });
        throw error;
      }
    },
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
