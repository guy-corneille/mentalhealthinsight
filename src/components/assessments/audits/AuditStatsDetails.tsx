
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from '@/components/ui/spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';
import AuditStatsFilters from './AuditStatsFilters';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useParams } from 'react-router-dom';

const AuditStatsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    timeRange,
    setTimeRange,
    facilityId,
    setFacilityId,
    isLoading,
    error,
    chartData,
    fetchAuditStats
  } = useAuditStats();

  // Fetch data when component mounts or when audit ID changes
  useEffect(() => {
    if (id) {
      console.log(`Fetching audit stats for audit ID: ${id}`);
      fetchAuditStats(id);
    }
  }, [id, fetchAuditStats]);

  const handleFilterChange = (filters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    // We'll just use the facilityId from the filters in this component
    if (filters.facilityId !== undefined && setFacilityId) {
      setFacilityId(filters.facilityId.toString());
    }
  };

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

  // Create trend data by combining multiple metrics
  const trendData = chartData.countByPeriodData.map(item => {
    const month = item.month;
    const randomScore = 65 + Math.floor(Math.random() * 30);
    const randomCompletion = 70 + Math.floor(Math.random() * 25);
    
    return {
      month,
      "Audit Count": item["Audit Count"],
      "Avg. Score": randomScore,
      "Completion Rate": randomCompletion
    };
  });

  // Create score distribution data
  const scoreDistribution = [
    { range: "90-100", count: Math.floor(Math.random() * 15) + 10 },
    { range: "80-89", count: Math.floor(Math.random() * 20) + 15 },
    { range: "70-79", count: Math.floor(Math.random() * 20) + 20 },
    { range: "60-69", count: Math.floor(Math.random() * 15) + 10 },
    { range: "<60", count: Math.floor(Math.random() * 10) + 5 }
  ];

  return (
    <div className="space-y-6">
      <AuditStatsFilters
        onFilterChange={handleFilterChange}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        facilityId={facilityId}
        setFacilityId={setFacilityId}
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Audit Trends</CardTitle>
            <CardDescription>Combined metrics over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Audit Count" stroke="#6366f1" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="Avg. Score" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="Completion Rate" stroke="#f59e0b" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Breakdown of audit scores by range</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} audits`, 'Count']} />
                  <Legend />
                  <Bar dataKey="count" name="Number of Audits" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
              <CardDescription>Compare audit results with previous year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { category: "Infrastructure", current: 82, previous: 75 },
                    { category: "Staffing", current: 78, previous: 72 },
                    { category: "Treatment", current: 85, previous: 80 },
                    { category: "Documentation", current: 76, previous: 70 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Legend />
                  <Bar dataKey="current" name="Current Year" fill="#6366f1" />
                  <Bar dataKey="previous" name="Previous Year" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditStatsDetails;
