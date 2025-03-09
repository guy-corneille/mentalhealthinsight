
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths } from 'date-fns';
import { FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { downloadReportAsCSV } from '@/utils/reportUtils';

// Mock audit criteria categories
const auditCategories = [
  { id: 1, name: 'Infrastructure & Safety' },
  { id: 2, name: 'Staffing & Training' },
  { id: 3, name: 'Treatment & Care' },
  { id: 4, name: 'Rights & Dignity' }
];

const AuditReports: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [category, setCategory] = useState('all');
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
  
  // Generate consistent mock data based on selected category
  const generateAuditScores = () => {
    const monthLabels = getLast12Months();
    
    // Create a progressive improvement trend with some random variation
    return monthLabels.map((month, index) => {
      const monthIndex = index; // Use index for trending patterns
      const baseScore = 70; // Starting baseline score
      const improvementRate = 0.8; // Monthly improvement
      
      return {
        month,
        'Infrastructure & Safety': Math.min(95, baseScore + (monthIndex * improvementRate)) - (index % 3 * 1.2),
        'Staffing & Training': Math.min(95, baseScore - 5 + (monthIndex * improvementRate * 1.1)) + (index % 4 * 1),
        'Treatment & Care': Math.min(95, baseScore - 3 + (monthIndex * improvementRate * 0.9)) - (index % 3 * 0.8),
        'Rights & Dignity': Math.min(95, baseScore - 8 + (monthIndex * improvementRate * 1.2)) + (index % 5 * 0.5),
        'Overall Score': Math.min(95, baseScore - 4 + (monthIndex * improvementRate)) 
      };
    });
  };
  
  const auditScores = generateAuditScores();
  
  // Audit compliance by criterion
  const complianceData = [
    { name: 'Physical Safety Features', pass: 92, partial: 6, fail: 2 },
    { name: 'Staff Qualifications', pass: 89, partial: 8, fail: 3 },
    { name: 'Treatment Documentation', pass: 85, partial: 10, fail: 5 },
    { name: 'Patient Rights', pass: 94, partial: 5, fail: 1 },
    { name: 'Emergency Procedures', pass: 91, partial: 7, fail: 2 }
  ];
  
  // Audit frequency over time
  const auditFrequencyData = getLast12Months().map((month, index) => {
    // More audits in recent months to show improvement in process
    const baseAudits = 8;
    const monthIndex = 11 - index;
    
    return {
      month,
      'Scheduled Audits': Math.max(5, Math.min(15, baseAudits + Math.floor(monthIndex/4))),
      'Completed Audits': Math.max(4, Math.min(15, baseAudits - 1 + Math.floor(monthIndex/4) - (index % 3 === 0 ? 1 : 0)))
    };
  });
  
  const handleExportReport = () => {
    setIsExporting(true);
    
    try {
      // Create an array for audit scores data
      const scoreDataForExport = auditScores.map(item => ({
        Period: item.month,
        'Infrastructure & Safety': item['Infrastructure & Safety'],
        'Staffing & Training': item['Staffing & Training'],
        'Treatment & Care': item['Treatment & Care'],
        'Rights & Dignity': item['Rights & Dignity'],
        'Overall Score': item['Overall Score']
      }));
      
      // Create an array for compliance data
      const complianceDataForExport = complianceData.map(item => ({
        'Criterion': item.name,
        'Pass Rate (%)': item.pass,
        'Partial Compliance (%)': item.partial,
        'Fail Rate (%)': item.fail
      }));
      
      // Create an array for audit frequency data
      const frequencyDataForExport = auditFrequencyData.map(item => ({
        Period: item.month,
        'Scheduled Audits': item['Scheduled Audits'],
        'Completed Audits': item['Completed Audits'],
      }));
      
      // Download data files
      downloadReportAsCSV(scoreDataForExport, 'Audit_Scores_By_Category');
      
      // Short delay between downloads to prevent browser blocking
      setTimeout(() => {
        downloadReportAsCSV(complianceDataForExport, 'Audit_Compliance_By_Criterion');
      }, 300);
      
      setTimeout(() => {
        downloadReportAsCSV(frequencyDataForExport, 'Audit_Frequency');
        
        toast({
          title: "Reports downloaded",
          description: "Audit reports have been downloaded as CSV files",
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
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {auditCategories.map(c => (
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
            <CardTitle>Audit Scores by Category</CardTitle>
            <CardDescription>
              Average scores across evaluation categories over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={auditScores}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Overall Score" 
                    name="Overall Score" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                  />
                  {category === 'all' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="Infrastructure & Safety" 
                        stroke="#8b5cf6"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Staffing & Training" 
                        stroke="#a855f7"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Treatment & Care" 
                        stroke="#d946ef"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Rights & Dignity" 
                        stroke="#ec4899"
                      />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={auditCategories.find(c => c.id.toString() === category)?.name || ""} 
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
            <CardTitle>Compliance by Criterion</CardTitle>
            <CardDescription>
              Pass, partial, and fail rates for key audit criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={complianceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pass" name="Pass" stackId="a" fill="#6366f1" />
                  <Bar dataKey="partial" name="Partial" stackId="a" fill="#94a3b8" />
                  <Bar dataKey="fail" name="Fail" stackId="a" fill="#cbd5e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audit Frequency</CardTitle>
            <CardDescription>
              Number of scheduled vs. completed audits over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={auditFrequencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="Scheduled Audits" 
                    fill="#6366f1" 
                  />
                  <Bar 
                    dataKey="Completed Audits" 
                    fill="#94a3b8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditReports;
