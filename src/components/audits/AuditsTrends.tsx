
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditScoreChart from "@/components/facilities/audits/AuditScoreChart";
import AuditCategoriesChart from "@/components/audits/AuditCategoriesChart";

const AuditsTrends: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'year' | 'quarter' | 'month'>('quarter');
  
  // Mock data
  const yearlyData = [
    { name: 'Jan', score: 75 },
    { name: 'Feb', score: 78 },
    { name: 'Mar', score: 82 },
    { name: 'Apr', score: 79 },
    { name: 'May', score: 84 },
    { name: 'Jun', score: 83 },
    { name: 'Jul', score: 85 },
    { name: 'Aug', score: 87 },
    { name: 'Sep', score: 84 },
    { name: 'Oct', score: 88 },
    { name: 'Nov', score: 90 },
    { name: 'Dec', score: 92 }
  ];
  
  const quarterlyData = [
    { name: 'Jan', score: 78 },
    { name: 'Feb', score: 82 },
    { name: 'Mar', score: 85 },
  ];
  
  const monthlyData = [
    { name: 'Week 1', score: 84 },
    { name: 'Week 2', score: 87 },
    { name: 'Week 3', score: 91 },
    { name: 'Week 4', score: 92 },
  ];

  const categoriesData = [
    { name: 'Infrastructure', score: 85 },
    { name: 'Staffing', score: 78 },
    { name: 'Treatment', score: 92 },
    { name: 'Rights', score: 87 },
    { name: 'Documentation', score: 80 }
  ];
  
  // Get data based on timeframe
  const chartData = timeframe === 'year' ? yearlyData : 
                   timeframe === 'quarter' ? quarterlyData : monthlyData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle>Facility Audit Scores</CardTitle>
              <CardDescription>Overall performance trends across all facilities</CardDescription>
            </div>
            <Tabs defaultValue="quarter" onValueChange={(value) => setTimeframe(value as any)}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <AuditScoreChart chartData={chartData} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Score By Category</CardTitle>
            <CardDescription>Performance breakdown by evaluation category</CardDescription>
          </CardHeader>
          <CardContent>
            <AuditCategoriesChart chartData={categoriesData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Facility Comparison</CardTitle>
            <CardDescription>Benchmark comparison between facilities</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Facility comparison data visualization would appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditsTrends;
