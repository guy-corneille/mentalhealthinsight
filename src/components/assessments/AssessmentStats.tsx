import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { Spinner } from '@/components/ui/spinner';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StatCard from '@/components/ui/StatCard';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const AssessmentStats: React.FC = () => {
  const { 
    timeRange, 
    setTimeRange, 
    patientGroup,
    setPatientGroup,
    isLoading,
    chartData 
  } = useAssessmentStats();
  
  const exportData = (chartType: string) => {
    if (!chartData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    let data: any[] = [];
    
    if (chartType === 'period') {
      csvContent += "Month,Assessment Count\n";
      data = chartData.countByPeriodData;
      data.forEach(item => {
        csvContent += `${item.month},${item['Assessment Count']}\n`;
      });
    } else if (chartType === 'facility') {
      csvContent += "Facility,Assessment Count\n";
      data = chartData.facilityData;
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'type') {
      csvContent += "Assessment Type,Count\n";
      data = chartData.typeData;
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'criteria') {
      csvContent += "Criteria,Average Score\n";
      data = chartData.scoreByCriteriaData || [];
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assessment-${chartType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading assessment statistics...</p>
      </div>
    );
  }
  
  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">No data available for the selected filters.</p>
        <Button variant="outline" className="mt-4" onClick={() => setTimeRange('12months')}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={patientGroup} onValueChange={setPatientGroup}>
          <SelectTrigger>
            <SelectValue placeholder="All Patient Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Patient Groups</SelectItem>
              <SelectItem value="children">Children (0-17)</SelectItem>
              <SelectItem value="adults">Adults (18-64)</SelectItem>
              <SelectItem value="elderly">Elderly (65+)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Last 12 Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Assessments" 
          value={chartData.summary.totalCount.toLocaleString()} 
          icon={<BarChartIcon className="h-5 w-5 text-blue-600" />}
          description={`${timeRange === 'ytd' ? 'Year to date' : `Last ${timeRange}`}`}
        />
        
        <StatCard 
          title="Completion Rate" 
          value={`${chartData.summary.completionRate}%`} 
          icon={<PieChartIcon className="h-5 w-5 text-emerald-600" />}
          description="Assessments with scores"
        />
        
        <StatCard 
          title="Average Score" 
          value={`${chartData.summary.averageScore.toFixed(1)}`} 
          icon={<LineChartIcon className="h-5 w-5 text-purple-600" />}
          description="Overall assessment score"
        />
        
        <StatCard 
          title="Patient Coverage" 
          value={`${chartData.summary.patientCoverage}%`} 
          icon={<PieChartIcon className="h-5 w-5 text-orange-600" />}
          description="Patients assessed"
        />
      </div>
      
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["period", "facility", "type", "criteria"]} className="space-y-4">
          <AccordionItem value="period" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Assessments by Period</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('period')}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <AccordionTrigger className="p-0 m-0 hover:no-underline" />
                </div>
              </div>
            </div>
            <AccordionContent>
              <div className="p-4 pt-0">
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.countByPeriodData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                      className="animate-fade-in"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar 
                        dataKey="Assessment Count" 
                        fill="#3b82f6" 
                        radius={[5, 5, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Total assessments completed in each time period.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="facility" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-medium">Assessments by Facility</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('facility')}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <AccordionTrigger className="p-0 m-0 hover:no-underline" />
                </div>
              </div>
            </div>
            <AccordionContent>
              <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart className="animate-fade-in">
                      <Pie
                        data={chartData.facilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        animationDuration={1000}
                      >
                        {chartData.facilityData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} assessments`, 'Count']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility</TableHead>
                        <TableHead>Assessment Count</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartData.facilityData.map((facility, index) => {
                        const totalValue = chartData.facilityData.reduce((sum, item) => sum + item.value, 0);
                        const percentage = ((facility.value / totalValue) * 100).toFixed(1);
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: facility.color }}
                                ></div>
                                {facility.name}
                              </div>
                            </TableCell>
                            <TableCell>{facility.value}</TableCell>
                            <TableCell>{percentage}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2 px-4">
                Distribution of assessments across different facilities.
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="type" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-medium">Assessments by Type</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('type')}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <AccordionTrigger className="p-0 m-0 hover:no-underline" />
                </div>
              </div>
            </div>
            <AccordionContent>
              <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.typeData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      className="animate-fade-in"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                      <Bar 
                        dataKey="value" 
                        name="Count"
                        animationDuration={1000}
                        radius={[0, 5, 5, 0]}
                      >
                        {chartData.typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment Type</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartData.typeData.map((type, index) => {
                        const totalValue = chartData.typeData.reduce((sum, item) => sum + item.value, 0);
                        const percentage = ((type.value / totalValue) * 100).toFixed(1);
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: type.color }}
                                ></div>
                                {type.name}
                              </div>
                            </TableCell>
                            <TableCell>{type.value}</TableCell>
                            <TableCell>{percentage}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2 px-4">
                Distribution of assessments by type (Initial, Follow-up, Discharge).
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="criteria" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Average Score by Assessment Criteria</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('criteria')}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <AccordionTrigger className="p-0 m-0 hover:no-underline" />
                </div>
              </div>
            </div>
            <AccordionContent>
              <div className="p-4 pt-0">
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.scoreByCriteriaData || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      className="animate-fade-in"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Average Score" 
                        fill="#3b82f6"
                        radius={[0, 5, 5, 0]}
                        animationDuration={1000}
                      >
                        {(chartData.scoreByCriteriaData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Average assessment scores by evaluation criteria.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AssessmentStats;
