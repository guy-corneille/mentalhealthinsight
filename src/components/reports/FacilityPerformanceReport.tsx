
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths } from 'date-fns';
import { FileDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const FacilityPerformanceReport: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('12months');
  const [facility, setFacility] = useState('all');
  
  // Mock facilities data
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' }
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
  const occupancyData = getLast12Months().map((month, index) => {
    return {
      month,
      'Central Hospital': 75 + Math.floor(Math.random() * 15),
      'Eastern District Clinic': 65 + Math.floor(Math.random() * 15),
      'Northern Community Center': 50 + Math.floor(Math.random() * 15),
      'Southern District Hospital': 70 + Math.floor(Math.random() * 15),
    };
  });
  
  const complianceData = getLast12Months().map((month, index) => {
    return {
      month,
      'Regulatory Compliance': 85 + Math.floor(Math.random() * 10),
      'Quality Standards': 80 + Math.floor(Math.random() * 15),
      'Safety Metrics': 90 + Math.floor(Math.random() * 5),
    };
  });
  
  const resourceUtilization = [
    { name: 'Beds', utilized: 82, underutilized: 18 },
    { name: 'Operating Rooms', utilized: 75, underutilized: 25 },
    { name: 'Diagnostic Equipment', utilized: 68, underutilized: 32 },
    { name: 'Staff Hours', utilized: 91, underutilized: 9 },
    { name: 'Medications', utilized: 87, underutilized: 13 },
  ];

  const handleExportReport = () => {
    toast({
      title: "Report exported",
      description: "Facility performance report has been exported as PDF",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={facility} onValueChange={setFacility}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities.map(f => (
                  <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
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
        
        <Button onClick={handleExportReport} variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Facility Occupancy Rate</CardTitle>
            <CardDescription>
              Percentage of capacity utilized over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={occupancyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {facility === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="Central Hospital" stroke="#10b981" />
                      <Line type="monotone" dataKey="Eastern District Clinic" stroke="#6366f1" />
                      <Line type="monotone" dataKey="Northern Community Center" stroke="#8b5cf6" />
                      <Line type="monotone" dataKey="Southern District Hospital" stroke="#f59e0b" />
                    </>
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey={facilities.find(f => f.id.toString() === facility)?.name || ""} 
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
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>
              Current utilization rates across key resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceUtilization}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilized" stackId="a" fill="#10b981" name="Utilized %" />
                  <Bar dataKey="underutilized" stackId="a" fill="#e5e7eb" name="Underutilized %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance Metrics</CardTitle>
            <CardDescription>
              Key compliance indicators over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={complianceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Regulatory Compliance" stroke="#10b981" />
                  <Line type="monotone" dataKey="Quality Standards" stroke="#6366f1" />
                  <Line type="monotone" dataKey="Safety Metrics" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilityPerformanceReport;
