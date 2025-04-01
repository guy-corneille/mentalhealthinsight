
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from '@/components/ui/spinner';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  // Add the onFilterChange handler required by AuditStatsFilters
  const handleFilterChange = (filters: {
    facilityId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    // Update the facilityId based on the filter
    if (filters.facilityId !== undefined) {
      setFacilityId(filters.facilityId.toString());
    } else {
      setFacilityId('all');
    }
    
    // Note: timeRange is handled separately through the component's UI
  };

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
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <Card className="p-4 mb-6">
            <AuditStatsFilters 
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              facilityId={facilityId}
              setFacilityId={setFacilityId}
              onFilterChange={handleFilterChange}
            />
          </Card>
          
          <AuditStatisticsDisplay 
            facilityId={facilityId !== 'all' ? parseInt(facilityId, 10) : undefined}
            startDate={chartData?.dateRange?.startDate}
            endDate={chartData?.dateRange?.endDate}
          />
        </TabsContent>
        
        <TabsContent value="detailed" className="pt-6">
          <div className="animate-fade-in">
            <Card className="p-4 mb-6">
              <AuditStatsFilters 
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                facilityId={facilityId}
                setFacilityId={setFacilityId}
                onFilterChange={handleFilterChange}
              />
            </Card>
            
            <AuditStatisticsDisplay 
              facilityId={facilityId !== 'all' ? parseInt(facilityId, 10) : undefined}
              startDate={chartData?.dateRange?.startDate}
              endDate={chartData?.dateRange?.endDate}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrends;
