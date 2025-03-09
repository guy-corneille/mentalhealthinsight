
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths } from 'date-fns';
import { FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { downloadReportAsCSV } from '@/utils/reportUtils';

// Mock assessment criteria data that could come from the system
const assessmentCriteria = [
  { id: 1, name: 'Depression Severity', category: 'Mental Health' },
  { id: 2, name: 'Anxiety Levels', category: 'Mental Health' },
  { id: 3, name: 'Social Functioning', category: 'Functional' },
  { id: 4, name: 'Treatment Adherence', category: 'Compliance' },
  { id: 5, name: 'Risk Assessment', category: 'Safety' }
];

const AssessmentReports: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [criteriaType, setCriteriaType] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
  // Generate the last 12 months as labels
  const getLast12Months = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push(format(date, 'MMM yyyy'));
    }
    return months;
  };
  
  // Generate consistent mock data based on criteria type
  const generateAssessmentData = () => {
    const monthLabels = getLast12Months();
    
    // Create consistent patterns for different criteria
    return monthLabels.map((month, index) => {
      const baseValue = 65;
      const monthIndex = 11 - index; // Reverse index to create trending patterns
      
      return {
        month,
        'Depression Severity': baseValue - monthIndex * 0.6 + (index % 3 * 2),
        'Anxiety Levels': baseValue - monthIndex * 0.4 + (index % 4 * 1.5),
        'Social Functioning': baseValue + monthIndex * 0.5 - (index % 3 * 1),
        'Treatment Adherence': baseValue + monthIndex * 0.3 + (index % 5 * 0.8),
        'Risk Assessment': Math.max(10, baseValue - monthIndex * 0.7 - (index % 4 * 2)),
        average: baseValue + (monthIndex * 0.2)
      };
    });
  };
  
  const assessmentData = generateAssessmentData();
  
  // Generate assessment completion rate data
  const completionRateData = getLast12Months().map((month, index) => {
    // Create a pattern where completion rates generally improve over time
    const baseCompletion = 75;
    const monthIndex = 11 - index;
    return {
      month,
      'Completion Rate': Math.min(98, baseCompletion + monthIndex * 1.5),
      'Target Rate': 95
    };
  });
  
  // Criteria distribution across assessment types
  const distributionData = [
    { name: 'Depression Criteria', count: 245, color: '#6366f1' },
    { name: 'Anxiety Criteria', count: 198, color: '#8b5cf6' },
    { name: 'Social Functioning', count: 156, color: '#a855f7' },
    { name: 'Treatment Adherence', count: 132, color: '#d946ef' },
    { name: 'Risk Assessment', count: 87, color: '#ec4899' }
  ];
  
  const handleExportReport = () => {
    setIsExporting(true);
    
    try {
      // Create an array for assessment score data
      const scoreDataForExport = assessmentData.map(item => ({
        Period: item.month,
        'Depression Severity': item['Depression Severity'],
        'Anxiety Levels': item['Anxiety Levels'],
        'Social Functioning': item['Social Functioning'],
        'Treatment Adherence': item['Treatment Adherence'],
        'Risk Assessment': item['Risk Assessment'],
        'Average Score': item.average
      }));
      
      // Create an array for completion rate data
      const completionDataForExport = completionRateData.map(item => ({
        Period: item.month,
        'Completion Rate': item['Completion Rate'],
        'Target Rate': item['Target Rate']
      }));
      
      // Create an array for distribution data
      const distributionDataForExport = distributionData.map(item => ({
        'Criteria Type': item.name,
        'Count': item.count
      }));
      
      // Download data files
      downloadReportAsCSV(scoreDataForExport, 'Assessment_Scores');
      
      // Short delay between downloads to prevent browser blocking
      setTimeout(() => {
        downloadReportAsCSV(completionDataForExport, 'Assessment_Completion_Rates');
      }, 300);
      
      setTimeout(() => {
        downloadReportAsCSV(distributionDataForExport, 'Assessment_Criteria_Distribution');
        
        toast({
          title: "Reports downloaded",
          description: "Assessment reports have been downloaded as CSV files",
        });
        
        setIsExporting(false);
      }, 600);
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating the reports",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={criteriaType} onValueChange={setCriteriaType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Criteria Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Criteria Types</SelectItem>
                {assessmentCriteria.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
        
        <Button 
          onClick={handleExportReport} 
          variant="outline" 
          className="gap-2"
          disabled={isExporting}
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Scores by Criteria</CardTitle>
            <CardDescription>
              Average assessment scores over time by criteria type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={assessmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Average Score" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                  />
                  {criteriaType === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="Depression Severity" stroke="#8b5cf6" />
                      <Line type="monotone" dataKey="Anxiety Levels" stroke="#a855f7" />
                      <Line type="monotone" dataKey="Social Functioning" stroke="#d946ef" />
                      <Line type="monotone" dataKey="Treatment Adherence" stroke="#ec4899" />
                      <Line type="monotone" dataKey="Risk Assessment" stroke="#f43f5e" />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={assessmentCriteria.find(c => c.id.toString() === criteriaType)?.name || ""} 
                      stroke="#8b5cf6" 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Criteria Distribution</CardTitle>
            <CardDescription>
              Number of assessments by criteria type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Number of Assessments" 
                    fill="#6366f1" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Completion Rates</CardTitle>
            <CardDescription>
              Percentage of assessments completed over time vs. target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completionRateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Completion Rate" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Target Rate" 
                    stroke="#94a3b8" 
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentReports;
