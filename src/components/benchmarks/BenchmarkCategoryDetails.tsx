
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BenchmarkCategory, BenchmarkPerformance } from '@/features/benchmarks/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getPerformanceColor, getPerformanceBgColor } from '@/utils/benchmarkUtils';
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface BenchmarkCategoryDetailsProps {
  categoryId: string;
  performance?: BenchmarkPerformance;
  category?: BenchmarkCategory;
}

const BenchmarkCategoryDetails: React.FC<BenchmarkCategoryDetailsProps> = ({ 
  categoryId, 
  performance,
  category
}) => {
  if (!performance || !category) {
    return (
      <div className="text-center py-8">
        <p>No benchmark data available for this category</p>
      </div>
    );
  }
  
  // Sort metrics by status: below → at → above
  const sortedMetrics = [...performance.metrics].sort((a, b) => {
    const statusOrder = { 'below': 0, 'at': 1, 'above': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-healthiq-50 to-white">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Performance Score</div>
              <div className="text-4xl font-bold text-healthiq-700">
                {Math.round(performance.aggregateScore)}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Benchmarks Achieved</div>
              <div className="text-lg">
                {performance.metrics.filter(m => m.status === 'at' || m.status === 'above').length} 
                <span className="text-muted-foreground"> of </span> 
                {performance.metrics.length}
              </div>
            </div>
            
            <div className="hidden md:block">
              <Progress value={performance.aggregateScore} className="h-3 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h3 className="text-xl font-semibold mt-8 mb-4">Benchmark Metrics</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left py-3 px-4 font-medium">Metric</th>
              <th className="text-center py-3 px-4 font-medium">Current Value</th>
              <th className="text-center py-3 px-4 font-medium">Benchmark</th>
              <th className="text-center py-3 px-4 font-medium">Difference</th>
              <th className="text-center py-3 px-4 font-medium">Status</th>
              <th className="text-center py-3 px-4 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedMetrics.map(metric => (
              <tr key={metric.metricId} className="hover:bg-muted/50">
                <td className="py-3 px-4">{metric.metricName}</td>
                <td className="py-3 px-4 text-center font-medium">
                  {metric.facilityValue}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  {metric.benchmarkValue}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={getPerformanceColor(metric.status)}>
                    {metric.percentDifference >= 0 ? '+' : ''}
                    {Math.round(metric.percentDifference)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="outline" className={`${getPerformanceBgColor(metric.status)} border-0`}>
                    {metric.status === 'above' ? 'Exceeds' : 
                     metric.status === 'at' ? 'Meets' : 'Below'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center">
                  {metric.trend === 'improving' ? (
                    <div className="flex items-center justify-center text-emerald-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span className="text-sm">Improving</span>
                    </div>
                  ) : metric.trend === 'declining' ? (
                    <div className="flex items-center justify-center text-rose-600">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span className="text-sm">Declining</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-amber-600">
                      <Minus className="h-4 w-4 mr-1" />
                      <span className="text-sm">Steady</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Benchmark Sources</h4>
        <ul className="list-disc pl-6 space-y-1">
          {Array.from(new Set(category.metrics.map(m => m.source))).map(source => (
            <li key={source} className="text-sm">
              <span className="font-medium capitalize">{source}:</span> {' '}
              {source === 'national' ? 'National association standards and averages' : 
               source === 'regional' ? 'Regional healthcare network averages' : 
               source === 'organizational' ? 'Organization-defined targets' : 
               'Custom benchmark values'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BenchmarkCategoryDetails;
