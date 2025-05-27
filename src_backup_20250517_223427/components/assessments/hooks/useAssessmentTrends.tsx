
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths, parseISO, startOfYear } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import reportService from '@/services/reportService';

export function useAssessmentTrends() {
  const { toast } = useToast();
  const [patientGroup, setPatientGroup] = useState('all');
  const [timeRange, setTimeRange] = useState('12months');
  const [facilityId, setFacilityId] = useState<string | undefined>(undefined);

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

  // Generate mock data for demo purposes
  const getMockData = useCallback(() => {
    // Get months for the selected time range
    const getMonthLabels = () => {
      const { startDate } = getDateRange();
      const start = parseISO(startDate);
      const months = [];
      let current = start;
      const now = new Date();
      
      while (current <= now) {
        months.push(format(current, 'yyyy-MM-dd'));
        current = new Date(current.setMonth(current.getMonth() + 1));
      }
      
      return months;
    };
    
    const monthLabels = getMonthLabels();
    
    // Generate assessment volume data
    const assessmentCountData = monthLabels.map(date => {
      const baseInitial = patientGroup === 'children' ? 15 : patientGroup === 'elderly' ? 22 : 20;
      const baseFollowup = patientGroup === 'children' ? 30 : patientGroup === 'elderly' ? 40 : 35;
      const baseDischarge = patientGroup === 'children' ? 12 : patientGroup === 'elderly' ? 18 : 15;
      
      return {
        month: date,
        initial_count: baseInitial + Math.floor(Math.random() * 10),
        followup_count: baseFollowup + Math.floor(Math.random() * 15),
        discharge_count: baseDischarge + Math.floor(Math.random() * 8),
      };
    });
    
    // Generate outcome data
    const outcomeDistribution = {
      significant: patientGroup === 'children' ? 42 : patientGroup === 'elderly' ? 35 : 38,
      moderate: patientGroup === 'children' ? 28 : patientGroup === 'elderly' ? 22 : 25,
      minimal: patientGroup === 'children' ? 18 : patientGroup === 'elderly' ? 25 : 20,
      none: patientGroup === 'children' ? 8 : patientGroup === 'elderly' ? 15 : 12,
      worse: patientGroup === 'children' ? 4 : patientGroup === 'elderly' ? 8 : 5,
    };
    
    // Generate severity trends
    const severityData = monthLabels.map((date, index) => {
      const month = parseISO(date);
      
      // Create a slight trend of improvement over time
      const severeFactor = 1 - (index * 0.03);
      const moderateFactor = 1 - (index * 0.01);
      
      return {
        month: date,
        severe: Math.max(5, Math.floor((patientGroup === 'elderly' ? 30 : 25) * severeFactor)),
        moderate: Math.max(15, Math.floor((patientGroup === 'children' ? 40 : 45) * moderateFactor)),
        mild: Math.min(65, 30 + (index * 2) + (patientGroup === 'children' ? 5 : 0)),
      };
    });
    
    return {
      assessment_counts: assessmentCountData,
      outcome_distribution: outcomeDistribution,
      severity_trends: severityData
    };
  }, [patientGroup, timeRange, getDateRange]);

  // Format API data for charts
  const formatChartData = useCallback((apiData: any) => {
    if (!apiData) return null;
    
    // Format assessment counts for bar chart
    const assessmentCountData = apiData.assessment_counts.map((item: any) => ({
      month: format(parseISO(item.month), 'MMM yyyy'),
      'Initial Assessments': item.initial_count || 0,
      'Follow-up Assessments': item.followup_count || 0,
      'Discharge Assessments': item.discharge_count || 0
    }));
    
    // Format outcome distribution for pie chart
    const outcomeData = [
      { name: 'Significant Improvement', value: apiData.outcome_distribution.significant || 0, color: '#10b981' },
      { name: 'Moderate Improvement', value: apiData.outcome_distribution.moderate || 0, color: '#3b82f6' },
      { name: 'Minimal Improvement', value: apiData.outcome_distribution.minimal || 0, color: '#6366f1' },
      { name: 'No Change', value: apiData.outcome_distribution.none || 0, color: '#8b5cf6' },
      { name: 'Deterioration', value: apiData.outcome_distribution.worse || 0, color: '#ec4899' }
    ];
    
    // Format severity trends for line chart
    const severityData = apiData.severity_trends.map((item: any) => ({
      month: format(parseISO(item.month), 'MMM yyyy'),
      'Severe': item.severe || 0,
      'Moderate': item.moderate || 0,
      'Mild': item.mild || 0
    }));
    
    // Calculate summary statistics
    const totalAssessments = assessmentCountData.reduce(
      (sum: number, item: any) => 
        sum + item['Initial Assessments'] + item['Follow-up Assessments'] + item['Discharge Assessments'], 
      0
    );
    
    const lastMonthData = assessmentCountData[assessmentCountData.length - 1];
    const previousMonthData = assessmentCountData[assessmentCountData.length - 2] || { 
      'Initial Assessments': 0, 
      'Follow-up Assessments': 0, 
      'Discharge Assessments': 0 
    };
    
    const lastMonthTotal = lastMonthData 
      ? lastMonthData['Initial Assessments'] + lastMonthData['Follow-up Assessments'] + lastMonthData['Discharge Assessments']
      : 0;
      
    const previousMonthTotal = 
      previousMonthData['Initial Assessments'] + 
      previousMonthData['Follow-up Assessments'] + 
      previousMonthData['Discharge Assessments'];
    
    const monthlyChange = previousMonthTotal > 0 
      ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
      : 0;
    
    const positiveOutcomes = outcomeData
      .filter(item => item.name.includes('Improvement'))
      .reduce((sum, item) => sum + item.value, 0);
    
    const improvementRate = outcomeData.reduce((sum, item) => sum + item.value, 0) > 0
      ? (positiveOutcomes / outcomeData.reduce((sum, item) => sum + item.value, 0)) * 100
      : 0;
    
    return {
      assessmentCountData,
      outcomeData,
      severityData,
      summary: {
        totalAssessments,
        lastMonthTotal,
        monthlyChange,
        improvementRate
      }
    };
  }, []);

  // Fetch trends data
  const { isLoading, error, data: apiData } = useQuery({
    queryKey: ['assessmentTrends', timeRange, patientGroup, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const filters = {
        startDate,
        endDate,
        patientGroup: patientGroup !== 'all' ? patientGroup : undefined,
        facilityId
      };
      
      try {
        // For demo purposes, use mock data instead of actual API call
        // In production, we would use: await reportService.getAssessmentReports(filters);
        
        // Simulate network delay for better UX testing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return getMockData();
      } catch (error) {
        console.error('Error fetching assessment trends:', error);
        toast({
          title: "Failed to load trends",
          description: "Could not retrieve assessment trend data",
          variant: "destructive"
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
  
  const chartData = apiData ? formatChartData(apiData) : null;

  return {
    patientGroup,
    setPatientGroup,
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    isLoading,
    error,
    chartData
  };
}
