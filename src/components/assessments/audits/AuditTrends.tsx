
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';
import AuditStatisticsDisplay from './AuditStatisticsDisplay';
import AuditStatsFilters from './AuditStatsFilters';

const AuditTrends: React.FC = () => {
  const { 
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    chartData
  } = useAuditStats();

  // Add the onFilterChange handler required by AuditStatsFilters
  const handleFilterChange = (filters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    // Update the facilityId based on the filter
    if (filters.facilityId !== undefined) {
      setFacilityId(filters.facilityId.toString());
    } else {
      setFacilityId('all');
    }
    
    // Note: timeRange is handled separately through the component's UI
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <AuditStatsFilters 
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          facilityId={facilityId}
          setFacilityId={setFacilityId}
          onFilterChange={handleFilterChange}
        />
      </Card>
      
      <AuditStatisticsDisplay 
        facilityId={facilityId !== 'all' ? parseInt(facilityId, 10) : undefined}
        startDate={chartData?.dateRange?.startDate}
        endDate={chartData?.dateRange?.endDate}
      />
    </div>
  );
};

export default AuditTrends;
