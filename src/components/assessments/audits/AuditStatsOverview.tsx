
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from '@/components/ui/spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';
import AuditStatsSummaryCards from './AuditStatsSummaryCards';
import AuditStatsFilters from './AuditStatsFilters';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const AuditStatsOverview: React.FC = () => {
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
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load audit statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No audit data available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuditStatsFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        facilityId={facilityId}
        setFacilityId={setFacilityId}
      />

      <AuditStatsSummaryCards summary={chartData.summary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Audits by Facility</CardTitle>
            <CardDescription>Distribution across healthcare facilities</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.facilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.facilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} audits`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Types</CardTitle>
            <CardDescription>Breakdown by type of audit</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criteria Scores</CardTitle>
            <CardDescription>Average scores by evaluation criteria</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData.scoreByCriteriaData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Score']} />
                <Legend />
                <Bar dataKey="value" name="Average Score" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditStatsOverview;
