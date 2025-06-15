import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Activity, Users, Building } from 'lucide-react';

interface MetricHighlight {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const MonitoringCard = () => {
  const metrics: MetricHighlight[] = [
    {
      label: 'Patient Load',
      value: '85%',
      icon: <Users className="h-4 w-4 text-blue-500" />,
      description: 'Current facility utilization'
    },
    {
      label: 'Assessment Rate',
      value: '92%',
      icon: <Activity className="h-4 w-4 text-green-500" />,
      description: 'Completed vs scheduled'
    },
    {
      label: 'Active Facilities',
      value: '12',
      icon: <Building className="h-4 w-4 text-purple-500" />,
      description: 'Facilities reporting data'
    }
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Real-Time Monitoring</CardTitle>
          <CardDescription>Live facility metrics and performance</CardDescription>
        </div>
        <LineChart className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
        <Link to="/monitoring" className="block">
          <Button className="w-full" variant="outline">
            View Detailed Monitoring
            <LineChart className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MonitoringCard; 