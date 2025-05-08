
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BenchmarkCategory, BenchmarkPerformance } from '@/features/benchmarks/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getPerformanceColor, getPerformanceBgColor } from '@/utils/benchmarkUtils';
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // Prepare trend data for charts if available
  const hasTrendData = sortedMetrics.some(metric => 
    metric.historicalValues && metric.historicalValues.length > 0 && 
    metric.historicalLabels && metric.historicalLabels.length > 0
  );
  
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
      
      {/* Show trend charts if this is the Performance Trends category */}
      {categoryId === 'performance-trends' && hasTrendData && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mt-8 mb-4">Performance Over Time</h3>
          
          <div className="grid grid-cols-1 gap-6">
            {sortedMetrics.filter(metric => metric.historicalValues && metric.historicalValues.length > 0).map(metric => {
              // Prepare chart data
              const chartData = metric.historicalLabels?.map((label, index) => ({
                period: label,
                actual: metric.historicalValues?.[index] || 0,
                benchmark: metric.benchmarkValue
              }));
              
              return (
                <Card key={metric.metricId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metricName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            name="Actual Value" 
                            stroke="#6366f1" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="benchmark" 
                            name="Benchmark" 
                            stroke="#94a3b8" 
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Current: </span>
                        <span className={`font-medium ${getPerformanceColor(metric.status)}`}>
                          {metric.facilityValue.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Benchmark: </span>
                        <span className="font-medium text-gray-600">
                          {metric.benchmarkValue}%
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Trend: </span>
                        {metric.trend === 'improving' ? (
                          <span className="font-medium text-emerald-600 flex items-center">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Improving
                          </span>
                        ) : metric.trend === 'declining' ? (
                          <span className="font-medium text-rose-600 flex items-center">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            Declining
                          </span>
                        ) : (
                          <span className="font-medium text-amber-600 flex items-center">
                            <Minus className="h-4 w-4 mr-1" />
                            Steady
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
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
               source === 'historical' ? 'Historical performance data' :
               'Custom benchmark values'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BenchmarkCategoryDetails;
