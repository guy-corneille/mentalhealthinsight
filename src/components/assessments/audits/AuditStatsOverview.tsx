
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuditStatsSummaryCards from './AuditStatsSummaryCards';
import AuditStatsFilters from './AuditStatsFilters';

interface AuditStatsOverviewProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  facilityId: string;
  setFacilityId: (id: string) => void;
  chartData: any | null;
}

const AuditStatsOverview: React.FC<AuditStatsOverviewProps> = ({
  timeRange,
  setTimeRange,
  facilityId,
  setFacilityId,
  chartData
}) => {
  if (!chartData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No audit data available for the selected filters.</p>
      </div>
    );
  }

  const handleFilterChange = (filters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    if (filters.facilityId !== undefined) {
      setFacilityId(filters.facilityId.toString());
    } else {
      setFacilityId('all');
    }
  };

  return (
    <div className="space-y-6">
      <AuditStatsFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        facilityId={facilityId}
        setFacilityId={setFacilityId}
        onFilterChange={handleFilterChange}
      />

      {/* Basic Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Audits</CardTitle>
          <CardDescription>Number of audits conducted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{chartData.summary.totalCount}</div>
        </CardContent>
      </Card>

      {/* Audits Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Audits Over Time</CardTitle>
          <CardDescription>Total audits conducted per month</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.countByPeriodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Audit Count" stroke="#6366f1" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditStatsOverview;
