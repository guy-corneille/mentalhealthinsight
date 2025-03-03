
import React, { useState } from 'react';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssessmentTrends: React.FC = () => {
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('year');
  
  // Mock data for facilities
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' },
    { id: 5, name: 'Western Mental Health Center' }
  ];
  
  // Mock data for assessment trends
  const assessmentCountData = [
    { month: 'Jan', year: '2023', count: 42 },
    { month: 'Feb', year: '2023', count: 38 },
    { month: 'Mar', year: '2023', count: 45 },
    { month: 'Apr', year: '2023', count: 52 },
    { month: 'May', year: '2023', count: 48 },
    { month: 'Jun', year: '2023', count: 56 },
    { month: 'Jul', year: '2023', count: 62 },
    { month: 'Aug', year: '2023', count: 58 },
    { month: 'Sep', year: '2023', count: 64 },
    { month: 'Oct', year: '2023', count: 70 },
    { month: 'Nov', year: '2023', count: 65 },
    { month: 'Dec', year: '2023', count: 58 },
    { month: 'Jan', year: '2024', count: 68 },
    { month: 'Feb', year: '2024', count: 72 },
    { month: 'Mar', year: '2024', count: 78 }
  ];
  
  // Mock data for assessment outcomes
  const assessmentOutcomeData = [
    { name: 'Severe', value: 24 },
    { name: 'Moderate', value: 45 },
    { name: 'Mild', value: 68 },
    { name: 'Minimal', value: 53 }
  ];
  
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  
  // Mock data for facility comparison
  const facilityComparisonData = [
    { name: 'Central Hospital', assessments: 138, improvement: 72 },
    { name: 'Eastern District Clinic', assessments: 89, improvement: 65 },
    { name: 'Northern Community Center', assessments: 45, improvement: 58 },
    { name: 'Southern District Hospital', assessments: 76, improvement: 62 },
    { name: 'Western Mental Health Center', assessments: 62, improvement: 54 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-[280px]">
          <label className="text-sm font-medium mb-1 block">Facility</label>
          <Select value={facilityFilter} onValueChange={setFacilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-[280px]">
          <label className="text-sm font-medium mb-1 block">Time Range</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessments Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentCountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Assessments']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    name="Assessment Count" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Outcome Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentOutcomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {assessmentOutcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Patients']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Facility Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facilityComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assessments" fill="#4f46e5" name="Total Assessments" />
                  <Bar dataKey="improvement" fill="#22c55e" name="Improvement Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentTrends;
