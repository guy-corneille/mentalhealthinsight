
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, parseISO, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import reportService, { ReportFilter, AssessmentStatistics } from '@/services/reportService';

export function useAssessmentStats() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [facilityId, setFacilityId] = useState<string | undefined>(undefined);
  const [patientGroup, setPatientGroup] = useState('all');

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

  // Format chart data for display
  const formatChartData = useCallback((apiData: AssessmentStatistics) => {
    if (!apiData) return null;
    
    // Format assessment counts by period for line/bar chart
    const countByPeriodData = apiData.countByPeriod.map((item) => ({
      month: format(parseISO(item.period), 'MMM yyyy'),
      'Assessment Count': item.count
    }));
    
    // Format assessment counts by facility for pie/bar chart
    const facilityData = apiData.countByFacility.map(facility => ({
      name: facility.facilityName,
      value: facility.count,
      color: getRandomColor(facility.facilityId)
    }));
    
    // Format assessment counts by type for pie chart
    const typeData = [
      { name: 'Initial', value: apiData.countByType.initial, color: '#10b981' },
      { name: 'Follow-up', value: apiData.countByType.followup, color: '#3b82f6' },
      { name: 'Discharge', value: apiData.countByType.discharge, color: '#6366f1' }
    ];
    
    return {
      countByPeriodData,
      facilityData,
      typeData,
      summary: {
        totalCount: apiData.totalCount,
        completionRate: apiData.completionRate,
        mostCommonType: getMostCommonType(apiData.countByType),
        mostActiveLocation: getMostActiveLocation(apiData.countByFacility)
      }
    };
  }, []);
  
  // Helper function to determine most common assessment type
  const getMostCommonType = (countByType: { initial: number, followup: number, discharge: number }) => {
    const { initial, followup, discharge } = countByType;
    if (initial > followup && initial > discharge) return 'Initial';
    if (followup > initial && followup > discharge) return 'Follow-up';
    return 'Discharge';
  };
  
  // Helper function to determine most active location
  const getMostActiveLocation = (countByFacility: Array<{ facilityId: string, facilityName: string, count: number }>) => {
    if (!countByFacility.length) return '';
    return countByFacility.reduce((max, facility) => 
      max.count > facility.count ? max : facility
    ).facilityName;
  };
  
  // Helper function to generate consistent colors based on ID
  const getRandomColor = (id: string) => {
    const colors = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];
    const index = parseInt(id, 10) % colors.length;
    return colors[index >= 0 ? index : 0];
  };

  // Fetch assessment statistics
  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['assessmentStats', timeRange, patientGroup, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const filters: ReportFilter = {
        startDate,
        endDate,
        patientGroup: patientGroup !== 'all' ? patientGroup : undefined,
        facilityId
      };
      
      try {
        return await reportService.getAssessmentStatistics(filters);
      } catch (error) {
        console.error('Error fetching assessment statistics:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid multiple error messages
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Failed to load statistics",
          description: "Could not retrieve assessment statistics data",
          variant: "destructive"
        });
      }
    }
  });
  
  const chartData = apiData ? formatChartData(apiData) : null;

  return {
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    patientGroup,
    setPatientGroup,
    isLoading,
    error,
    chartData
  };
}
