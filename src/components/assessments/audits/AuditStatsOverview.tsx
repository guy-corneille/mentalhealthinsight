
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AuditStatsSummaryCards from './AuditStatsSummaryCards';
import AuditStatsFilters from './AuditStatsFilters';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from 'date-fns';

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
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => {
            setTimeRange('12months');
            setFacilityId('all');
          }}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  const exportData = (chartType: string) => {
    if (!chartData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    let data: any[] = [];
    
    if (chartType === 'period') {
      csvContent += "Month,Audit Count\n";
      data = chartData.countByPeriodData;
      data.forEach((item: any) => {
        csvContent += `${item.month},${item['Audit Count']}\n`;
      });
    } else if (chartType === 'facility') {
      csvContent += "Facility,Audit Count\n";
      data = chartData.facilityData;
      data.forEach((item: any) => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'type') {
      csvContent += "Audit Type,Count\n";
      data = chartData.typeData;
      data.forEach((item: any) => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'criteria') {
      csvContent += "Criteria,Average Score\n";
      data = chartData.scoreByCriteriaData || [];
      data.forEach((item: any) => {
        csvContent += `${item.name},${item.value}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-${chartType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle filter changes
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

      <AuditStatsSummaryCards summary={chartData.summary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audits Over Time Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Audits Over Time</CardTitle>
              <CardDescription>Total audits conducted per month</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('period')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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

        {/* Audits by Facility Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Audits by Facility</CardTitle>
              <CardDescription>Distribution across healthcare facilities</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('facility')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
                  {chartData.facilityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} audits`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Audit Types Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Audit Types</CardTitle>
              <CardDescription>Breakdown by type of audit</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('type')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
                  {chartData.typeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Criteria Scores Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Criteria Scores</CardTitle>
              <CardDescription>Average scores by evaluation criteria</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('criteria')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
