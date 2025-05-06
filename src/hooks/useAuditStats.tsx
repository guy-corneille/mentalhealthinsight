
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Types for audit stats
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

export interface AuditStatsResponse {
  summary: AuditSummary;
  facilities: FacilityStat[];
  criteria: CriteriaStat[];
}

export interface ChartData {
  summary: AuditSummary;
  facilities: FacilityStat[];
  criteria: CriteriaStat[];
  countByPeriodData: any[];
}

export function useAuditStats() {
  const { toast } = useToast();
  
  // State for filters
  const [timeRange, setTimeRange] = useState<string>('12months');
  const [facilityId, setFacilityId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specificAuditId, setSpecificAuditId] = useState<string | null>(null);

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
  const formatChartData = useCallback((apiData: AuditStatsResponse): ChartData | null => {
    if (!apiData) {
      console.log("No audit stats data available to format");
      return null;
    }
    
    // Prepare period data for chart
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

  // Function to fetch audit stats for a specific audit ID
  const fetchAuditStats = useCallback((auditId: string) => {
    console.log(`Setting specific audit ID to: ${auditId}`);
    setSpecificAuditId(auditId);
  }, []);

  // Search function
  const handleSearchChange = useCallback((query: string) => {
    console.log(`Search query changed to: ${query}`);
    setSearchQuery(query);
  }, []);

  // Query for audit stats
  const { isLoading, error, data: apiData, refetch } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId, specificAuditId, searchQuery],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      const params = {
        startDate,
        endDate,
        search: searchQuery || undefined,
        ...(facilityId !== 'all' && { facilityId }),
        ...(specificAuditId && { auditId: specificAuditId })
      };
      
      console.log("Requesting audit stats with params:", params);
      
      try {
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
    enabled: true, // Always fetch when parameters change
  });
  
  const chartData = apiData ? formatChartData(apiData) : null;

  return {
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    searchQuery,
    handleSearchChange,
    isLoading,
    error,
    chartData,
    fetchAuditStats,
    refetch
  };
}
