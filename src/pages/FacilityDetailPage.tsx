import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Activity, Users, Building, Percent } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFacilityDetail } from '@/hooks/useFacilityDetail';

const FacilityDetailPage = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const { loading, error, facilityDetail: data } = useFacilityDetail(facilityId);

  const renderMetricCard = (
    title: string,
    value: number | string,
    description: string,
    icon: React.ReactNode,
    isPercentage = false
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof value === 'number' ? isPercentage ? `${value.toFixed(1)}%` : value : value}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderAssessmentMetrics = (timeframe: 'today' | 'ninety_days') => {
    if (!data?.current_metrics) return null;
    
    const metrics = data.current_metrics[timeframe === 'today' ? 'today' : 'ninety_days'];
    const title = timeframe === 'today' ? "Today's Metrics" : '90-Day Metrics';
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Assessment completion statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Total Assessments</p>
                <p className="text-2xl font-bold">{metrics.total_assessments}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{metrics.completed_assessments}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.completion_rate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <Layout>
        <div className="p-4">
          <p className="text-red-500">Error loading facility details: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {loading ? <Skeleton className="h-9 w-[200px]" /> : data?.facility.name}
          </h2>
          <p className="text-muted-foreground">
            Detailed metrics and performance analysis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard(
            "Active Patients",
            data?.current_metrics?.active_patients || 0,
            "Currently active patients",
            <Users className="h-4 w-4 text-muted-foreground" />
          )}
          {renderMetricCard(
            "Capacity Utilization",
            data?.current_metrics?.capacity_utilization || 0,
            "Current facility utilization",
            <Percent className="h-4 w-4 text-muted-foreground" />,
            true
          )}
          {renderMetricCard(
            "Facility Status",
            data?.facility.status || 'Unknown',
            "Current operational status",
            <Building className="h-4 w-4 text-muted-foreground" />
          )}
          {renderMetricCard(
            "Total Capacity",
            data?.facility.capacity || 0,
            "Maximum patient capacity",
            <Users className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {renderAssessmentMetrics('today')}
          {renderAssessmentMetrics('ninety_days')}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>
              Assessment completion trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Historical data visualization will be implemented here
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FacilityDetailPage; 
 