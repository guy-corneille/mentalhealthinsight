
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AuditStatisticsDisplay from './AuditStatisticsDisplay';
import AuditStatsFilters from './AuditStatsFilters';

const AuditTrends: React.FC = () => {
  const [filters, setFilters] = useState({
    facilityId: undefined as number | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const handleFilterChange = (newFilters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    console.log('Filter changed:', newFilters);
    setFilters({
      ...filters,
      ...newFilters
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <AuditStatsFilters onFilterChange={handleFilterChange} />
      </Card>
      
      <AuditStatisticsDisplay 
        facilityId={filters.facilityId}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />
    </div>
  );
};

export default AuditTrends;
