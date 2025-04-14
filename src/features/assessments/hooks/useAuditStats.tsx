
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Simplified audit data structure matching the API response
type AuditData = {
  audit_id: string;
  criteria_name: string;
  score: number;
  notes?: string;
  id?: number;
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

  // Simplified data formatting focused on basic metrics
  const formatChartData = useCallback((apiData: AuditData[]) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("No data available to format");
      return null;
    }
    
    // Count by Month
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

    // Average Scores by Criteria Type
    const criteriaScores = apiData.reduce((acc: { [key: string]: { total: number; count: number } }, audit) => {
      if (!acc[audit.criteria_name]) {
        acc[audit.criteria_name] = { total: 0, count: 0 };
      }
      acc[audit.criteria_name].total += audit.score;
      acc[audit.criteria_name].count++;
      return acc;
    }, {});

    const averageScores = Object.entries(criteriaScores).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    // Calculate basic summary statistics
    const totalAudits = apiData.length;
    const overallAverageScore = Math.round(
      apiData.reduce((sum, audit) => sum + audit.score, 0) / totalAudits
    );

    return {
      countByPeriodData: countByPeriod.map(item => ({
        month: item.month,
        'Audit Count': item.count
      })),
      scoreByCriteriaData: averageScores,
      summary: {
        totalCount: totalAudits,
        averageScore: overallAverageScore,
        completionRate: 100,
        mostCommonType: averageScores[0]?.name || 'None',
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
