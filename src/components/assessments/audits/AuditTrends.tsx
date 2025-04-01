
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AuditStatisticsDisplay from './AuditStatisticsDisplay';
import reportService, { type ReportFilter } from '@/features/reports/services/reportService';
import { useFacilities } from '@/services/facilityService';

const AuditTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12months');
  const [facilityId, setFacilityId] = useState<string>('all');
  const { toast } = useToast();
  const { data: facilities } = useFacilities();

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        break;
      case '12months':
      default:
        startDate.setMonth(now.getMonth() - 12);
        break;
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    };
  };

  // Fetch audit statistics with the selected filters
  const { isLoading, error, data: auditStats, refetch } = useQuery({
    queryKey: ['auditStats', timeRange, facilityId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const filters: ReportFilter = {
        startDate,
        endDate,
        facilityId: facilityId !== 'all' ? facilityId : undefined
      };
      
      try {
        console.log("Fetching audit statistics with filters:", filters);
        return await reportService.getAuditStatistics(filters);
      } catch (error) {
        console.error('Error fetching audit statistics:', error);
        toast({
          title: "Error fetching audit data",
          description: "Could not retrieve audit statistics. Using fallback data.",
          variant: "destructive"
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleApplyFilters = () => {
    refetch();
  };

  const handleResetFilters = () => {
    setTimeRange('12months');
    setFacilityId('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive view of audit statistics and trends
          </p>
        </div>
      </div>

      {/* Simple Filter Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="facility">Facility</Label>
              <Select value={facilityId} onValueChange={setFacilityId}>
                <SelectTrigger id="facility">
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities?.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
          <span className="ml-2">Loading audit statistics...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 my-4">
          <p className="text-red-600">Failed to load audit statistics</p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Statistics Display */}
      {!isLoading && !error && auditStats && (
        <AuditStatisticsDisplay 
          facilityId={facilityId !== 'all' ? parseInt(facilityId, 10) : undefined}
          startDate={getDateRange().startDate}
          endDate={getDateRange().endDate}
        />
      )}
    </div>
  );
};

export default AuditTrends;
