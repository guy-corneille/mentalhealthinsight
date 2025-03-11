import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths } from 'date-fns';

// Generate the last 12 months as labels
const getLast12Months = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM yyyy'));
  }
  return months;
};

const AuditTrends: React.FC = () => {
  const [facility, setFacility] = useState('all');
  const [timeRange, setTimeRange] = useState('12months');
  
  // Mock facilities data
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' }
  ];
  
  // Mock data for charts
  const scoreData = getLast12Months().map((month, index) => {
    return {
      month,
      'Central Hospital': 70 + Math.floor(Math.random() * 25),
      'Eastern District Clinic': 60 + Math.floor(Math.random() * 25),
      'Northern Community Center': 50 + Math.floor(Math.random() * 25),
      'Southern District Hospital': 65 + Math.floor(Math.random() * 25),
      average: 65 + Math.floor(Math.random() * 15)
    };
  });
  
  const categoryData = [
    { name: 'Infrastructure', score: 78, color: '#10b981' },
    { name: 'Staff Competency', score: 65, color: '#0ea5e9' },
    { name: 'Treatment Outcomes', score: 82, color: '#6366f1' },
    { name: 'Patient Satisfaction', score: 71, color: '#8b5cf6' },
    { name: 'Documentation', score: 58, color: '#ec4899' }
  ];
  
  const improvementData = getLast12Months().map((month, index) => {
    return {
      month,
      'Infrastructure': index > 0 ? 70 + Math.floor(Math.random() * 15) : 70,
      'Staff Competency': index > 0 ? 60 + Math.floor(Math.random() * 15) : 60,
      'Treatment Outcomes': index > 0 ? 80 + Math.floor(Math.random() * 15) : 80,
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={facility} onValueChange={setFacility}>
          <SelectTrigger>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audit Score Trends</CardTitle>
            <CardDescription>
              Average audit scores over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={scoreData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average" stroke="#6366f1" name="Average Score" />
                  {facility === 'all' ? (
                    <>
                      <Line type="monotone" dataKey="Central Hospital" stroke="#10b981" />
                      <Line type="monotone" dataKey="Eastern District Clinic" stroke="#0ea5e9" />
                      <Line type="monotone" dataKey="Northern Community Center" stroke="#8b5cf6" />
                      <Line type="monotone" dataKey="Southern District Hospital" stroke="#ec4899" />
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
            <CardTitle>Scores by Category</CardTitle>
            <CardDescription>
              Average scores across evaluation categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#6366f1" name="Category Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Improvement Trends by Category</CardTitle>
            <CardDescription>
              Score changes over time by evaluation category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={improvementData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Infrastructure" stroke="#10b981" />
                  <Line type="monotone" dataKey="Staff Competency" stroke="#0ea5e9" />
                  <Line type="monotone" dataKey="Treatment Outcomes" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditTrends;
