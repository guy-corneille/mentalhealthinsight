
import React, { useState } from 'react';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
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

const AuditTrends: React.FC = () => {
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('year');
  
  // Mock data for trends
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' },
    { id: 5, name: 'Western Mental Health Center' }
  ];
  
  // Score trend data over time
  const overallScoreData = [
    { month: 'Jan', year: '2023', score: 76, category1: 72, category2: 78, category3: 80 },
    { month: 'Mar', year: '2023', score: 79, category1: 76, category2: 77, category3: 83 },
    { month: 'May', year: '2023', score: 83, category1: 78, category2: 80, category3: 88 },
    { month: 'Jul', year: '2023', score: 81, category1: 75, category2: 80, category3: 85 },
    { month: 'Sep', year: '2023', score: 85, category1: 82, category2: 83, category3: 89 },
    { month: 'Nov', year: '2023', score: 87, category1: 85, category2: 85, category3: 92 },
    { month: 'Jan', year: '2024', score: 89, category1: 87, category2: 86, category3: 94 },
    { month: 'Mar', year: '2024', score: 92, category1: 89, category2: 89, category3: 96 }
  ];
  
  // Facility comparison data
  const facilityComparisonData = [
    { name: 'Central Hospital', score: 92, previous: 87 },
    { name: 'Eastern District Clinic', score: 78, previous: 73 },
    { name: 'Northern Community Center', score: 65, previous: 58 },
    { name: 'Southern District Hospital', score: 84, previous: 80 },
    { name: 'Western Mental Health Center', score: 71, previous: 65 }
  ];
  
  // Category breakdown data
  const categoryBreakdownData = [
    { name: 'Infrastructure', score: 88 },
    { name: 'Staffing', score: 82 },
    { name: 'Patient Care', score: 91 },
    { name: 'Documentation', score: 78 },
    { name: 'Medication', score: 85 },
    { name: 'Safety', score: 93 }
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
            <CardTitle>Score Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overallScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    name="Overall Score" 
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
            <CardTitle>Facility Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facilityComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Legend />
                  <Bar dataKey="score" fill="#4f46e5" name="Current Score" />
                  <Bar dataKey="previous" fill="#93c5fd" name="Previous Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overall">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overall">Overall Trends</TabsTrigger>
                <TabsTrigger value="category">Category Breakdown</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall" className="mt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overallScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="category1" 
                        stroke="#22c55e" 
                        name="Infrastructure" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="category2" 
                        stroke="#eab308" 
                        name="Staffing"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="category3" 
                        stroke="#f43f5e" 
                        name="Patient Care"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="category" className="mt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Legend />
                      <Bar dataKey="score" fill="#4f46e5" name="Category Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditTrends;
