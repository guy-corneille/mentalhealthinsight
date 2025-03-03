
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subMonths } from 'date-fns';

const AssessmentTrends: React.FC = () => {
  const [patientGroup, setPatientGroup] = useState('all');
  const [timeRange, setTimeRange] = useState('12months');
  
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
  const assessmentCountData = getLast12Months().map((month, index) => {
    return {
      month,
      'Initial Assessments': 20 + Math.floor(Math.random() * 15),
      'Follow-up Assessments': 35 + Math.floor(Math.random() * 20),
      'Discharge Assessments': 15 + Math.floor(Math.random() * 10)
    };
  });
  
  const outcomeData = [
    { name: 'Significant Improvement', value: 38, color: '#10b981' },
    { name: 'Moderate Improvement', value: 25, color: '#6366f1' },
    { name: 'Minimal Improvement', value: 20, color: '#0ea5e9' },
    { name: 'No Change', value: 12, color: '#8b5cf6' },
    { name: 'Deterioration', value: 5, color: '#ec4899' }
  ];
  
  const severityData = getLast12Months().map((month, index) => {
    return {
      month,
      'Severe': 25 - (index % 5),
      'Moderate': 45 - (index % 3),
      'Mild': 30 + (index % 4)
    };
  });

  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Volume</CardTitle>
            <CardDescription>
              Number of assessments conducted over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentCountData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Initial Assessments" fill="#10b981" />
                  <Bar dataKey="Follow-up Assessments" fill="#6366f1" />
                  <Bar dataKey="Discharge Assessments" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Treatment Outcomes</CardTitle>
            <CardDescription>
              Distribution of patient outcomes after treatment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {outcomeData.map((entry, index) => (
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
            <CardTitle>Symptom Severity Trends</CardTitle>
            <CardDescription>
              Distribution of patient symptom severity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={severityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Severe" stroke="#ef4444" />
                  <Line type="monotone" dataKey="Moderate" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="Mild" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentTrends;
