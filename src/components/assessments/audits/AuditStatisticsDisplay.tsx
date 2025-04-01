
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '@/services/api';

interface AuditStatisticsProps {
  facilityId?: number;
  startDate?: string;
  endDate?: string;
}

interface AuditStatistic {
  totalCount: number;
  countByFacility: { facilityId: string; facilityName: string; count: number }[];
  countByType: { [key: string]: number };
  countByPeriod: { period: string; count: number }[];
  averageScore: number;
  patientCoverage: number;
  scoreByCriteria: { criteriaId: string; criteriaName: string; averageScore: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AuditStatisticsDisplay: React.FC<AuditStatisticsProps> = ({ facilityId, startDate, endDate }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['auditStatistics', facilityId, startDate, endDate],
    queryFn: async () => {
      // Construct query string based on provided filters
      const params = new URLSearchParams();
      if (facilityId) params.append('facilityId', facilityId.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      console.log(`Fetching audit statistics with filters: ${queryString}`);
      
      const response = await api.get<AuditStatistic>(`/api/reports/audit-statistics/${queryString}`);
      console.log('Audit statistics response:', response);
      return response;
    }
  });

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
      <div className="bg-red-50 p-4 rounded-md border border-red-200 my-4">
        <p className="text-red-600">Failed to load audit statistics</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No audit data available for the selected filters.
      </div>
    );
  }

  const stats = data;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-healthiq-600">{stats.averageScore}%</div>
            <Progress value={stats.averageScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Facility Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.patientCoverage}%</div>
            <Progress value={stats.patientCoverage} className="h-2 mt-2 bg-emerald-100">
              <div className="h-full bg-emerald-500 rounded-full" />
            </Progress>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Tabs defaultValue="facilities">
        <TabsList className="mb-4">
          <TabsTrigger value="facilities">By Facility</TabsTrigger>
          <TabsTrigger value="criteria">By Criteria</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="types">Audit Types</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audits by Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.countByFacility}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="facilityName" 
                      angle={-45} 
                      textAnchor="end"
                      height={80}
                      interval={0} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#047857" name="Number of Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.scoreByCriteria}
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="criteriaName" width={90} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#0ea5e9" name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.countByPeriod}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="period" 
                      angle={-45} 
                      textAnchor="end"
                      height={60}
                      interval={0}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audits by Type</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.countByType).map(([key, value]) => ({
                        name: key === 'initial' ? 'Infrastructure' : 
                              key === 'followup' ? 'Staffing' : 
                              'Treatment',
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(stats.countByType).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} audits`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditStatisticsDisplay;
