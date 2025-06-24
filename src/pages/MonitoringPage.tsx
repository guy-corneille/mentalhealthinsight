import React, { useState } from 'react';
import { LineChart as LineChartIcon, Activity, Users, Building, Percent, Search, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from '@/components/layout/Layout';
import { useMetrics } from '@/hooks/useMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ITEMS_PER_PAGE = 10;

interface SortableHeaderProps {
  column: string;
  label: string;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label, sortBy, sortDirection, onSort }) => {
  return (
    <Button 
      variant="ghost" 
      className="p-0 h-auto font-semibold flex items-center text-xs"
      onClick={() => onSort(column)}
    >
      {label}
      {sortBy === column ? (
        sortDirection === 'asc' ? 
          <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
          <ArrowDownIcon className="h-3 w-3 ml-1" />
      ) : (
        <ArrowUpDownIcon className="h-3 w-3 ml-1" />
      )}
    </Button>
  );
};

const MonitoringPage: React.FC = () => {
  const { loading, error, allFacilitiesMetrics: metrics = [] } = useMetrics();
  const [timeframe, setTimeframe] = useState<'today' | '90days'>('today');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'completion' | 'capacity'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'warning' | 'ok'>('all');
  const { toast } = useToast();
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  // Calculate overview stats
  const totalActivePatients = metrics?.reduce((sum, m) => sum + m.active_patients, 0) || 0;
  
  // Calculate completion rates based on timeframe
  const avgCompletionRate = metrics?.length > 0
    ? metrics.reduce((sum, m) => sum + (
      timeframe === 'today' ? m.completion_rate : m.ninety_day_completion_rate
    ), 0) / metrics.length
    : 0;
    
  const avgCapacityUtil = metrics?.length > 0
    ? metrics.reduce((sum, m) => sum + m.capacity_utilization, 0) / metrics.length
    : 0;
  const totalFacilities = metrics?.length || 0;

  // Filter and sort facilities
  const filteredFacilities = metrics
    .filter(facility => {
      const matchesSearch = facility.facility_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : filterStatus === 'warning' 
          ? facility.capacity_utilization >= 80
          : facility.capacity_utilization < 80;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.facility_name.localeCompare(b.facility_name);
        case 'completion':
          return (timeframe === 'today' ? b.completion_rate : b.ninety_day_completion_rate) 
            - (timeframe === 'today' ? a.completion_rate : a.ninety_day_completion_rate);
        case 'capacity':
          return b.capacity_utilization - a.capacity_utilization;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderCardContent = (value: number | string, isPercentage = false) => {
    if (loading) {
      return <Skeleton className="h-8 w-24" />;
    }
    return (
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? isPercentage ? `${value.toFixed(1)}%` : value : value}
      </div>
    );
  };

  const renderMetricsTable = () => {
    if (loading) {
      return <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: 'all' | 'warning' | 'ok') => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="warning">High Utilization</SelectItem>
                <SelectItem value="ok">Normal Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={(value: 'name' | 'completion' | 'capacity') => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Facility Name</SelectItem>
              <SelectItem value="completion">Completion Rate</SelectItem>
              <SelectItem value="capacity">Capacity Utilization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Active Patients</TableHead>
                <TableHead className="text-right">Capacity Util.</TableHead>
                <TableHead className="text-right">Completion Rate</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFacilities.map((facility) => (
                <TableRow
                  key={facility.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/monitoring/facility/${facility.id}`)}
                >
                  <TableCell className="font-medium">{facility.facility_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        facility.capacity_utilization >= 80 ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      {facility.capacity_utilization >= 80 ? 'High Load' : 'Normal'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{facility.active_patients}</TableCell>
                  <TableCell className="text-right">
                    <span className={`${
                      facility.capacity_utilization >= 80 ? 'text-red-500' : 'text-green-700'
                    }`}>
                      {facility.capacity_utilization.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {timeframe === 'today'
                      ? `${facility.completion_rate.toFixed(1)}%`
                      : `${facility.ninety_day_completion_rate.toFixed(1)}%`
                    }
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(facility.timestamp), 'MMM dd, h:mm a')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredFacilities.length)} of {filteredFacilities.length} facilities
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Facility Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for your mental health facilities
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {renderCardContent(totalActivePatients)}
                  <p className="text-xs text-muted-foreground">Across all facilities</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessment Completion</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Tabs value={timeframe} className="w-full" onValueChange={(v) => setTimeframe(v as 'today' | '90days')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="90days">90 Days</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {renderCardContent(avgCompletionRate, true)}
                    <p className="text-xs text-muted-foreground">
                      {timeframe === 'today' ? 'Today\'s completion rate' : '90-day completion rate'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {renderCardContent(avgCapacityUtil, true)}
                  <p className="text-xs text-muted-foreground">Average across facilities</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {renderCardContent(totalFacilities)}
                  <p className="text-xs text-muted-foreground">Reporting metrics</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Facility Capacity Utilization</CardTitle>
                  <CardDescription>
                    Current capacity utilization by facility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="facility_name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Capacity']}
                          />
                          <Bar 
                            dataKey="capacity_utilization" 
                            fill="#0ea5e9"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Facility Status</CardTitle>
                  <CardDescription>
                    Current facility capacity status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {metrics.map((facility) => (
                        <div
                          key={facility.id}
                          className="flex flex-col space-y-1 pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                          onClick={() => navigate(`/monitoring/facility/${facility.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${
                                facility.capacity_utilization >= 80 ? 'bg-red-500' : 'bg-green-500'
                              }`} />
                              <span className="font-medium">{facility.facility_name}</span>
                            </div>
                            <span className={`${
                              facility.capacity_utilization >= 80 ? 'text-red-500' : 'text-green-700'
                            } font-medium`}>
                              {facility.capacity_utilization.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last updated: {format(new Date(facility.timestamp), 'MMM dd, h:mm a')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Tabs value={timeframe} className="w-[400px]" onValueChange={(v) => setTimeframe(v as 'today' | '90days')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="today">Today's Metrics</TabsTrigger>
                  <TabsTrigger value="90days">90-Day Metrics</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {renderMetricsTable()}
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Critical Alerts */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center space-y-0">
                  <div className="flex-1">
                    <CardTitle>Critical Alerts</CardTitle>
                    <CardDescription>High priority issues requiring immediate attention</CardDescription>
                  </div>
                  {metrics.filter(f => f.capacity_utilization >= 80).length > 0 && (
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">
                        {metrics.filter(f => f.capacity_utilization >= 80).length}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {metrics.filter(f => f.capacity_utilization >= 80).map(facility => (
                        <div key={`capacity-${facility.id}`} 
                          className="flex items-start space-x-4 p-4 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                          onClick={() => navigate(`/monitoring/facility/${facility.id}`)}
                        >
                          <div className="p-2 bg-red-100 rounded-full">
                            <Percent className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-red-900">High Capacity Alert</p>
                            <p className="text-sm text-red-700">
                              {facility.facility_name} is at {facility.capacity_utilization.toFixed(1)}% capacity utilization
                            </p>
                            <p className="text-xs text-red-600">
                              Last updated: {format(new Date(facility.timestamp), 'MMM dd, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {metrics.filter(f => f.capacity_utilization >= 80).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No critical alerts</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Warning Alerts */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0">
                  <div className="flex-1">
                    <CardTitle>Performance Warnings</CardTitle>
                    <CardDescription>Completion rate and assessment issues</CardDescription>
                  </div>
                  {metrics.filter(f => (
                    timeframe === 'today' ? f.completion_rate < 70 : f.ninety_day_completion_rate < 70
                  )).length > 0 && (
                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-600">
                        {metrics.filter(f => (
                          timeframe === 'today' ? f.completion_rate < 70 : f.ninety_day_completion_rate < 70
                        )).length}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="space-y-4">
                      {metrics.filter(f => (
                        timeframe === 'today' ? f.completion_rate < 70 : f.ninety_day_completion_rate < 70
                      )).map(facility => (
                        <div key={`completion-${facility.id}`} 
                          className="flex items-start space-x-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
                          onClick={() => navigate(`/monitoring/facility/${facility.id}`)}
                        >
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Activity className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-yellow-900">Low Completion Rate</p>
                            <p className="text-sm text-yellow-700">
                              {facility.facility_name} has a {timeframe === 'today' 
                                ? `${facility.completion_rate.toFixed(1)}% completion rate today`
                                : `${facility.ninety_day_completion_rate.toFixed(1)}% completion rate over 90 days`
                              }
                            </p>
                            <p className="text-xs text-yellow-600">
                              Last updated: {format(new Date(facility.timestamp), 'MMM dd, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {metrics.filter(f => (
                        timeframe === 'today' ? f.completion_rate < 70 : f.ninety_day_completion_rate < 70
                      )).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No performance warnings</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0">
                  <div className="flex-1">
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Data reporting and connectivity</CardDescription>
                  </div>
                  {metrics.filter(f => {
                    const lastUpdate = new Date(f.timestamp);
                    const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
                    return hoursSinceUpdate > 1;
                  }).length > 0 && (
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {metrics.filter(f => {
                          const lastUpdate = new Date(f.timestamp);
                          const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
                          return hoursSinceUpdate > 1;
                        }).length}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="space-y-4">
                      {metrics.filter(f => {
                        const lastUpdate = new Date(f.timestamp);
                        const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
                        return hoursSinceUpdate > 1;
                      }).map(facility => (
                        <div key={`stale-${facility.id}`} 
                          className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => navigate(`/monitoring/facility/${facility.id}`)}
                        >
                          <div className="p-2 bg-blue-100 rounded-full">
                            <LineChartIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-blue-900">Stale Metrics</p>
                            <p className="text-sm text-blue-700">
                              {facility.facility_name} hasn't reported new metrics recently
                            </p>
                            <p className="text-xs text-blue-600">
                              Last update: {format(new Date(facility.timestamp), 'MMM dd, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {metrics.filter(f => {
                        const lastUpdate = new Date(f.timestamp);
                        const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
                        return hoursSinceUpdate > 1;
                      }).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">All systems reporting normally</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* No Data Message */}
              {metrics.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground">No facility data available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and view facility reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No reports generated yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MonitoringPage; 