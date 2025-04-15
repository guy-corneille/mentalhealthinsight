
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Simplified audit data structure
type AuditData = {
  audit_id: string;
};

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

  // Simplified data formatting focused only on count by month
  const formatChartData = useCallback((apiData: AuditData[]) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("No data available to format");
      return null;
    }
    
    // Count audits by Month
    const countByPeriod = apiData.reduce((acc: { month: string; count: number }[], audit) => {
      const month = format(new Date(audit.audit_id.split('-')[0]), 'MMM yyyy');
      const existingMonth = acc.find(item => item.month === month);
      
      if (existingMonth) {
        existingMonth.count++;
      } else {
        acc.push({ month, count: 1 });
      }
      return acc;
    }, []);

    return {
      countByPeriodData: countByPeriod.map(item => ({
        month: item.month,
        'Audit Count': item.count
      })),
      summary: {
        totalCount: apiData.length
      }
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
        const response = await api.get<AuditData[]>('/api/reports/audit-statistics/', { params });
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
