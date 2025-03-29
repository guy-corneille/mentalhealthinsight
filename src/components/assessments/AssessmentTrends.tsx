
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { useAssessmentTrends } from './hooks/useAssessmentTrends';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Spinner } from '@/components/ui/spinner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StatCard from '@/components/ui/StatCard';

const AssessmentTrends: React.FC = () => {
  const { 
    patientGroup, 
    setPatientGroup, 
    timeRange, 
    setTimeRange, 
    isLoading,
    chartData
  } = useAssessmentTrends();
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    volume: true,
    outcomes: true,
    severity: true
  });
  
  // Handle section toggle
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };
  
  // Export chart data to CSV
  const exportData = (chartType: string) => {
    if (!chartData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    let data: any[] = [];
    
    // Prepare data based on chart type
    if (chartType === 'volume') {
      csvContent += "Month,Initial Assessments,Follow-up Assessments,Discharge Assessments\n";
      data = chartData.assessmentCountData;
      data.forEach(item => {
        csvContent += `${item.month},${item['Initial Assessments']},${item['Follow-up Assessments']},${item['Discharge Assessments']}\n`;
      });
    } else if (chartType === 'outcomes') {
      csvContent += "Outcome,Count\n";
      data = chartData.outcomeData;
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'severity') {
      csvContent += "Month,Severe,Moderate,Mild\n";
      data = chartData.severityData;
      data.forEach(item => {
        csvContent += `${item.month},${item['Severe']},${item['Moderate']},${item['Mild']}\n`;
      });
    }
    
    // Create download link and trigger it
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
        <p className="ml-2 text-muted-foreground">Loading assessment trends...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
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
      
      {/* Summary Statistics */}
      {chartData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Assessments" 
            value={chartData.summary.totalAssessments.toLocaleString()} 
            icon={<BarChartIcon className="h-5 w-5 text-blue-600" />}
            description={`${timeRange === 'ytd' ? 'Year to date' : `Last ${timeRange}`}`}
          />
          
          <StatCard 
            title="Last Month" 
            value={chartData.summary.lastMonthTotal.toLocaleString()} 
            icon={<LineChartIcon className="h-5 w-5 text-emerald-600" />}
            trend={chartData.summary.monthlyChange >= 0 
              ? `↑ ${Math.abs(chartData.summary.monthlyChange).toFixed(1)}% from previous` 
              : `↓ ${Math.abs(chartData.summary.monthlyChange).toFixed(1)}% from previous`
            }
          />
          
          <StatCard 
            title="Improvement Rate" 
            value={`${chartData.summary.improvementRate.toFixed(1)}%`} 
            icon={<PieChartIcon className="h-5 w-5 text-purple-600" />}
            description="Patients showing improvement"
          />
          
          <StatCard 
            title="Most Common" 
            value="Follow-up" 
            icon={<BarChartIcon className="h-5 w-5 text-orange-600" />}
            description="Assessment type"
          />
        </div>
      )}
      
      {/* Charts */}
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["volume", "outcomes", "severity"]} className="space-y-4">
          {/* Assessment Volume Chart */}
          <AccordionItem value="volume" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Assessment Volume</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('volume')}
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
                  {chartData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.assessmentCountData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                        className="animate-fade-in"
                      >
                        <defs>
                          <linearGradient id="initialFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="followupFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="dischargeFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
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
                          dataKey="Initial Assessments" 
                          fill="url(#initialFill)" 
                          stroke="#10b981" 
                          strokeWidth={1}
                          radius={[5, 5, 0, 0]}
                          animationDuration={1000}
                        />
                        <Bar 
                          dataKey="Follow-up Assessments" 
                          fill="url(#followupFill)" 
                          stroke="#3b82f6" 
                          strokeWidth={1}
                          radius={[5, 5, 0, 0]}
                          animationDuration={1000}
                          animationBegin={300}
                        />
                        <Bar 
                          dataKey="Discharge Assessments" 
                          fill="url(#dischargeFill)" 
                          stroke="#6366f1" 
                          strokeWidth={1}
                          radius={[5, 5, 0, 0]}
                          animationDuration={1000}
                          animationBegin={600}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  This chart shows the volume of different assessment types over time.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Treatment Outcomes Chart */}
          <AccordionItem value="outcomes" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-medium">Treatment Outcomes</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('outcomes')}
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
                  {chartData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart className="animate-fade-in">
                        <Pie
                          data={chartData.outcomeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          animationDuration={1000}
                          animationBegin={300}
                        >
                          {chartData.outcomeData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="#fff"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} patients`, 'Count']}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e5e7eb'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Distribution of patient outcomes after completing treatment plans.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Severity Trends Chart */}
          <AccordionItem value="severity" className="border rounded-lg overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-medium">Symptom Severity Trends</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('severity')}
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
                  {chartData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData.severityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                        className="animate-fade-in"
                      >
                        <defs>
                          <linearGradient id="severeFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="moderateFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="mildFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
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
                        <Area 
                          type="monotone" 
                          dataKey="Severe" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          fill="url(#severeFill)" 
                          activeDot={{ r: 6 }} 
                          animationDuration={1000}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Moderate" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          fill="url(#moderateFill)" 
                          activeDot={{ r: 6 }}
                          animationDuration={1000}
                          animationBegin={300}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Mild" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          fill="url(#mildFill)" 
                          activeDot={{ r: 6 }}
                          animationDuration={1000}
                          animationBegin={600}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  This chart tracks changes in patient symptom severity over time.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AssessmentTrends;
