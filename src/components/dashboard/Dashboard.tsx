
import React from 'react';
import StatsOverview from './StatsOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      {/* Real stats from our API data */}
      <StatsOverview />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Compliance Stats - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Stats</CardTitle>
            <CardDescription>Facility compliance overview</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        
        {/* Recent Assessments - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Latest patient assessments</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        
        {/* Improvement Trends - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Improvement Trends</CardTitle>
            <CardDescription>Patient outcome metrics</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        
        {/* Performance Metrics - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Staff performance overview</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
