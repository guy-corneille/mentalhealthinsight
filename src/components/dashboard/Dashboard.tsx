
import React from 'react';
import StatsOverview from './StatsOverview';
import BenchmarkOverview from './BenchmarkOverview';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your facility's performance and benchmarks
        </p>
      </div>
      
      <StatsOverview />
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Performance Benchmarks</h3>
        <BenchmarkOverview />
      </div>
    </div>
  );
};

export default Dashboard;
