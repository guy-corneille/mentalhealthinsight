
import React from 'react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';
import AuditStatsOverview from './AuditStatsOverview';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const AuditTrends: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    isLoading,
    error,
    chartData
  } = useAuditStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-2">Loading audit statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertTitle>Error loading statistics</AlertTitle>
        <AlertDescription>
          There was a problem loading the audit statistics. Please check that the API endpoints are correctly configured and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!chartData) {
    return (
      <Alert variant="default" className="my-4">
        <AlertTitle>No audit data available</AlertTitle>
        <AlertDescription>
          No audit statistics are available for the selected filters. Try changing your filters or adding audit data.
        </AlertDescription>
      </Alert>
    );
  }

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

      {/* Render the AuditStatsOverview component with our audit stats */}
      <AuditStatsOverview
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        facilityId={facilityId}
        setFacilityId={setFacilityId}
        chartData={chartData}
      />
    </div>
  );
};

export default AuditTrends;
