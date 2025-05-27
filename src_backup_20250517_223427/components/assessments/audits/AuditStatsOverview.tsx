
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

      {/* Summary Cards */}
      <AuditStatsSummaryCards summary={chartData.summary} />

      {/* Facilities Distribution */}
      {chartData.facilities && chartData.facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Distribution by Facility</CardTitle>
            <CardDescription>Number of audits conducted per facility</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
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
      )}

      {/* Criteria Scores */}
      {chartData.criteria && chartData.criteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Average Scores by Criteria</CardTitle>
            <CardDescription>Performance across different audit criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.criteria.map((criterion: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{criterion.name}</span>
                    <span className="text-sm font-medium">{criterion.averageScore}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-healthiq-600 rounded-full" 
                      style={{ width: `${criterion.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditStatsOverview;
