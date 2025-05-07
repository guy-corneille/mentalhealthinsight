
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BenchmarkCategory, BenchmarkPerformance } from '@/features/benchmarks/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getPerformanceColor, getPerformanceBgColor } from '@/utils/benchmarkUtils';
import { ArrowRight, BarChart3, ChevronRight } from 'lucide-react';

interface BenchmarkOverviewProps {
  categories: BenchmarkCategory[];
  performance: BenchmarkPerformance[];
  onCategorySelect: (categoryId: string) => void;
}

const BenchmarkOverview: React.FC<BenchmarkOverviewProps> = ({ categories, performance, onCategorySelect }) => {
  // Get overall score across all categories
  const overallScore = performance.length > 0
    ? Math.round(performance.reduce((sum, p) => sum + p.aggregateScore, 0) / performance.length)
    : 0;
  
  // Count metrics meeting or exceeding benchmarks
  const totalMetrics = performance.reduce((sum, p) => sum + p.metrics.length, 0);
  const meetsOrExceedsBenchmark = performance.reduce(
    (sum, p) => sum + p.metrics.filter(m => m.status === 'above' || m.status === 'at').length, 
    0
  );
  const benchmarkPercentage = totalMetrics > 0 
    ? Math.round((meetsOrExceedsBenchmark / totalMetrics) * 100)
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-healthiq-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Benchmark Score</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-4xl font-bold text-healthiq-700 mb-2">
              {overallScore}%
            </div>
            <Progress value={overallScore} className="h-2 mt-2" />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Aggregate score across all benchmark categories
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Metrics Meeting Benchmarks</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-4xl font-bold text-healthiq-700 mb-2">
              {benchmarkPercentage}%
            </div>
            <div className="text-sm">
              {meetsOrExceedsBenchmark} out of {totalMetrics} metrics
            </div>
            <Progress value={benchmarkPercentage} className="h-2 mt-2" />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Percentage of metrics meeting or exceeding benchmarks
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Benchmark Categories</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-4xl font-bold text-healthiq-700 mb-2">
              {categories.length}
            </div>
            <div className="text-sm">
              {totalMetrics} total metrics tracked
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0" onClick={() => {}}>
              View all categories
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h3 className="text-xl font-semibold mt-8 mb-4">
        Performance by Category
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performance.map(perf => (
          <Card key={perf.categoryId}>
            <CardHeader>
              <CardTitle className="text-lg">{perf.categoryName}</CardTitle>
              <CardDescription>
                {perf.metrics.length} benchmarks tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Performance Score</div>
                <div className="text-xl font-bold">{Math.round(perf.aggregateScore)}%</div>
              </div>
              <Progress value={perf.aggregateScore} className="h-2 mb-4" />
              
              <div className="space-y-3 mt-4">
                {perf.metrics.slice(0, 3).map(metric => (
                  <div key={metric.metricId} className="flex justify-between items-center">
                    <div className="text-sm">{metric.metricName}</div>
                    <div className={`text-sm font-medium ${getPerformanceColor(metric.status)}`}>
                      {metric.facilityValue} / {metric.benchmarkValue}
                    </div>
                  </div>
                ))}
                {perf.metrics.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    + {perf.metrics.length - 3} more metrics
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => onCategorySelect(perf.categoryId)}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BenchmarkOverview;
