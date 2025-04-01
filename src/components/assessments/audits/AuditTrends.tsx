
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

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <AuditStatsFilters 
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          facilityId={facilityId}
          setFacilityId={setFacilityId}
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
