
import React from 'react';
import Layout from '@/components/layout/Layout';
import BenchmarkDashboard from '@/components/benchmarks/BenchmarkDashboard';

const Benchmarks: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Benchmarks</h1>
          <p className="text-muted-foreground mt-1">
            Track facility performance against industry benchmarks and standards
          </p>
        </div>
        
        <BenchmarkDashboard />
      </div>
    </Layout>
  );
};

export default Benchmarks;
