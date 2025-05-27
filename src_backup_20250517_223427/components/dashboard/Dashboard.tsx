
import React from 'react';
import StatsOverview from './StatsOverview';
import BenchmarkOverview from '@/components/benchmarks/BenchmarkOverview';
import { useBenchmarking } from '@/features/benchmarks/hooks/useBenchmarking';
import { useNavigate } from 'react-router-dom';
import BenchmarkSkeleton from '@/components/benchmarks/BenchmarkSkeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { categories, benchmarkPerformance, isLoading } = useBenchmarking();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/benchmarks?category=${categoryId}`);
  };

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
        {isLoading ? (
          <BenchmarkSkeleton />
        ) : (
          <BenchmarkOverview 
            categories={categories}
            performance={benchmarkPerformance}
            onCategorySelect={handleCategorySelect}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
