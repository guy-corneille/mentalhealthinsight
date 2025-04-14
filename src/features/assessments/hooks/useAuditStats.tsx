
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

// Define the actual audit data structure based on API response
// Updated to match the exact fields returned by the API
type AuditData = {
  audit_id: string;
  criteria_name: string;
  score: number;
  notes?: string;
  id?: number;
  audit?: number;
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

  // Format chart data for display - adjusted to match the correct API response structure
  const formatChartData = useCallback((apiData: AuditData[]) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("useAuditStats - No API data provided to format");
      return null;
    }
    
    console.log("useAuditStats - Formatting chart data from:", apiData);
    
    try {
      // Group audits by month
      const countByPeriod = apiData.reduce((acc: any[], audit) => {
        // Try to extract a date from audit_id, but have a fallback if format isn't as expected
        let month;
        try {
          // Assuming audit_id starts with a date portion that can be parsed
          const datePart = audit.audit_id.split('-')[0];
          month = format(new Date(datePart), 'MMM yyyy');
        } catch (e) {
          // Fallback to current month if parsing fails
          month = format(new Date(), 'MMM yyyy');
          console.log("useAuditStats - Failed to parse date from audit_id, using current month");
        }
        
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
      
      // Group by criteria_name for scores
      const criteriaScores = apiData.reduce((acc: any, audit) => {
        const criteriaName = audit.criteria_name || 'Unknown';
        
        if (!acc[criteriaName]) {
          acc[criteriaName] = {
            scores: [],
            count: 0
          };
        }
        acc[criteriaName].scores.push(audit.score);
        acc[criteriaName].count++;
        return acc;
      }, {});
      
      // Calculate averages and prepare criteria data
      const scoreByCriteriaData = Object.entries(criteriaScores).map(([name, data]: [string, any]) => ({
        name,
        value: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
        color: getRandomColor(name)
      }));
      
      // Calculate type distribution (using first word of criteria_name as types)
      const typeGroups = apiData.reduce((acc: any, audit) => {
        const criteriaName = audit.criteria_name || 'Unknown';
        // Use first word of criteria as type
        const type = criteriaName.split(' ')[0]; 
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
      
      // Create mock facility data since it's not in the API response
      const facilityData = [
        { name: 'Main Hospital', value: Math.floor(apiData.length * 0.4), color: getRandomColor('facility1') },
        { name: 'Community Clinic', value: Math.floor(apiData.length * 0.3), color: getRandomColor('facility2') },
        { name: 'Outpatient Center', value: Math.floor(apiData.length * 0.2), color: getRandomColor('facility3') },
        { name: 'Rehabilitation Unit', value: apiData.length - Math.floor(apiData.length * 0.9), color: getRandomColor('facility4') }
      ];
      
      // Calculate summary statistics
      const result = {
        countByPeriodData,
        facilityData,
        typeData,
        scoreByCriteriaData,
        dateRange,
        summary: {
          totalCount: apiData.length,
          averageScore: Math.round(apiData.reduce((sum, audit) => sum + audit.score, 0) / apiData.length) || 0,
          completionRate: 100, // This will need to be calculated differently if we have completion status
          mostCommonType: typeData.length > 0 ? typeData.reduce((max, type) => type.value > max.value ? type : max, typeData[0]).name : 'None',
          mostActiveLocation: 'All Facilities' // This will need facility data to be meaningful
        }
      };
      
      console.log("useAuditStats - Formatted chart data:", result);
      return result;
    } catch (error) {
      console.error("useAuditStats - Error formatting chart data:", error);
      toast({
        title: "Error formatting data",
        description: "There was a problem processing the audit data",
        variant: "destructive",
      });
      return null;
    }
  }, [getDateRange, toast]);
  
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
    const index = id.toString().split('').reduce((total, char) => total + char.charCodeAt(0), 0) % colors.length;
    return colors[index >= 0 ? index : 0];
  };

  // Fetch audit statistics directly from API
  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      const params: any = {
        startDate,
        endDate
      };
      
      // Only add facilityId if it's not 'all'
      if (facilityId !== 'all') {
        params.facilityId = facilityId;
      }
      
      console.log("useAuditStats - Requesting audit stats with params:", params);
      
      try {
        // Direct API call with proper error handling
        const response = await api.get<AuditData[]>('/api/reports/audit-statistics/', { params });
        console.log("useAuditStats - Received API response:", response);
        
        if (!response) {
          throw new Error('Empty response from API');
        }
        
        // Ensure we're working with an array (even if empty)
        const auditData = Array.isArray(response) ? response : [];
        return auditData;
      } catch (error) {
        console.error("useAuditStats - Error fetching audit statistics:", error);
        toast({
          title: "Error loading audit data",
          description: "Could not retrieve audit statistics from the server",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Process the data for display
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
