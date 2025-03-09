
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subMonths } from 'date-fns';
import { FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { downloadReportAsCSV } from '@/utils/reportUtils';

const StaffEfficiencyReport: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [department, setDepartment] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
  // Mock departments data
  const departments = [
    { id: 1, name: 'General Medicine' },
    { id: 2, name: 'Mental Health' },
    { id: 3, name: 'Pediatrics' },
    { id: 4, name: 'Emergency Care' }
  ];
  
  // Generate the last 12 months as labels
  const getLast12Months = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push(format(date, 'MMM yyyy'));
    }
    return months;
  };
  
  // Mock data for charts
  const productivityData = getLast12Months().map((month, index) => {
    return {
      month,
      'General Medicine': 85 + Math.floor(Math.random() * 10),
      'Mental Health': 78 + Math.floor(Math.random() * 12),
      'Pediatrics': 82 + Math.floor(Math.random() * 8),
      'Emergency Care': 88 + Math.floor(Math.random() * 7),
    };
  });
  
  const staffPatientRatio = getLast12Months().map((month, index) => {
    return {
      month,
      'Average Ratio': 7.5 + (Math.random() * 1.5 - 0.75),
      'Target Ratio': 8
    };
  });
  
  const staffAllocation = [
    { name: 'Direct Patient Care', value: 68, color: '#10b981' },
    { name: 'Administrative Tasks', value: 15, color: '#6366f1' },
    { name: 'Training', value: 7, color: '#8b5cf6' },
    { name: 'Meetings', value: 6, color: '#f59e0b' },
    { name: 'Other Activities', value: 4, color: '#ec4899' }
  ];
  
  const handleExportReport = () => {
    setIsExporting(true);
    
    try {
      // Create an array for productivity data
      const productivityDataForExport = productivityData.map(item => ({
        Period: item.month,
        'General Medicine': item['General Medicine'],
        'Mental Health': item['Mental Health'],
        'Pediatrics': item['Pediatrics'],
        'Emergency Care': item['Emergency Care'],
      }));
      
      // Create an array for staff-patient ratio data
      const ratioDataForExport = staffPatientRatio.map(item => ({
        Period: item.month,
        'Average Ratio': item['Average Ratio'],
        'Target Ratio': item['Target Ratio'],
      }));
      
      // Create an array for staff allocation
      const allocationDataForExport = staffAllocation.map(item => ({
        'Activity Type': item.name,
        'Percentage': item.value,
      }));
      
      // Download productivity data
      downloadReportAsCSV(productivityDataForExport, 'Staff_Productivity');
      
      // Short delay between downloads to prevent browser blocking
      setTimeout(() => {
        downloadReportAsCSV(ratioDataForExport, 'Staff_Patient_Ratio');
      }, 300);
      
      setTimeout(() => {
        downloadReportAsCSV(allocationDataForExport, 'Staff_Time_Allocation');
        
        toast({
          title: "Reports downloaded",
          description: "Staff efficiency reports have been downloaded as CSV files",
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
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
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
            <CardTitle>Staff Productivity</CardTitle>
            <CardDescription>
              Productivity scores by department over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={productivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {department === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="General Medicine" stroke="#10b981" />
                      <Line type="monotone" dataKey="Mental Health" stroke="#6366f1" />
                      <Line type="monotone" dataKey="Pediatrics" stroke="#8b5cf6" />
                      <Line type="monotone" dataKey="Emergency Care" stroke="#f59e0b" />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={departments.find(d => d.id.toString() === department)?.name || ""} 
                      stroke="#10b981" 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Staff Time Allocation</CardTitle>
            <CardDescription>
              How staff time is distributed across activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {staffAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Staff-to-Patient Ratio</CardTitle>
            <CardDescription>
              Average number of patients per staff member over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={staffPatientRatio}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[4, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Average Ratio" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Target Ratio" stroke="#6366f1" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffEfficiencyReport;
