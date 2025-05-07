
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BenchmarkCategory } from '@/features/benchmarks/types';
import { calculateImprovementTarget } from '@/utils/benchmarkUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImprovementArea {
  metricId: string;
  metricName: string;
  facilityValue: number;
  benchmarkValue: number;
  percentDifference: number;
  status: string;
  categoryName: string;
  gap: number;
  trend?: string;
}

interface BenchmarkImprovementPlanProps {
  improvementAreas: ImprovementArea[];
  categories: BenchmarkCategory[];
}

const BenchmarkImprovementPlan: React.FC<BenchmarkImprovementPlanProps> = ({ 
  improvementAreas,
  categories
}) => {
  // Prepare data for the gap chart
  const gapChartData = improvementAreas.slice(0, 5).map(area => {
    // Determine if this is a metric where lower is better
    const isInverseMetric = area.metricId.includes('wait-time') || 
                          area.metricId.includes('readmission');
    
    // Calculate targets for 3, 6, and 12 month timeframes
    const target3Month = calculateImprovementTarget(
      area.facilityValue, 
      area.benchmarkValue, 
      3, 
      isInverseMetric
    );
    
    const target6Month = calculateImprovementTarget(
      area.facilityValue, 
      area.benchmarkValue, 
      6, 
      isInverseMetric
    );
    
    const target12Month = calculateImprovementTarget(
      area.facilityValue, 
      area.benchmarkValue, 
      12, 
      isInverseMetric
    );
    
    return {
      name: area.metricName,
      current: area.facilityValue,
      benchmark: area.benchmarkValue,
      '3 Month Target': target3Month,
      '6 Month Target': target6Month,
      '12 Month Target': target12Month
    };
  });
  
  return (
    <div className="space-y-6">
      {improvementAreas.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Priority Improvement Areas</CardTitle>
              <CardDescription>
                Focus on these metrics to have the biggest impact on your benchmark performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {improvementAreas.slice(0, 3).map((area, index) => {
                  // Determine if this is a metric where lower is better
                  const isInverseMetric = area.metricId.includes('wait-time') || 
                                        area.metricId.includes('readmission');
                  
                  // Calculate the improvement progress
                  const progressValue = isInverseMetric
                    ? Math.max(0, Math.min(100, 100 - (area.gap)))
                    : Math.max(0, Math.min(100, 100 - (area.gap)));
                  
                  // Calculate targets
                  const target3Month = calculateImprovementTarget(
                    area.facilityValue, 
                    area.benchmarkValue, 
                    3, 
                    isInverseMetric
                  );
                  
                  return (
                    <div key={area.metricId} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                        <div>
                          <h4 className="font-semibold text-lg">{area.metricName}</h4>
                          <p className="text-sm text-muted-foreground">{area.categoryName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">
                            {Math.round(area.gap)}% {isInverseMetric ? 'above' : 'below'} benchmark
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Current Value</span>
                          <span className="font-medium">{area.facilityValue}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Benchmark Target</span>
                          <span className="font-medium">{area.benchmarkValue}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">3-Month Goal</span>
                          <span className="font-medium">{target3Month.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Benchmark</span>
                          <span>{progressValue.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Recommended Actions:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {area.metricId.includes('readmission') ? (
                            <>
                              <li>Review discharge planning procedures</li>
                              <li>Enhance follow-up care coordination</li>
                              <li>Implement post-discharge check-in program</li>
                            </>
                          ) : area.metricId.includes('wait-time') ? (
                            <>
                              <li>Review scheduling efficiency</li>
                              <li>Analyze no-show patterns</li>
                              <li>Consider additional staffing during peak hours</li>
                            </>
                          ) : area.metricId.includes('completion') ? (
                            <>
                              <li>Implement assessment completion reminders</li>
                              <li>Provide staff training on assessment tools</li>
                              <li>Review workflow for assessment bottlenecks</li>
                            </>
                          ) : (
                            <>
                              <li>Review current protocols and procedures</li>
                              <li>Identify barriers to meeting the benchmark</li>
                              <li>Develop targeted improvement initiatives</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Improvement Projection</CardTitle>
              <CardDescription>
                Projected timeline to reach benchmark standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gapChartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#94a3b8" name="Current Value" />
                    <Bar dataKey="3 Month Target" fill="#a855f7" name="3 Month Target" />
                    <Bar dataKey="6 Month Target" fill="#8b5cf6" name="6 Month Target" />
                    <Bar dataKey="12 Month Target" fill="#6366f1" name="12 Month Target" />
                    <Bar dataKey="benchmark" fill="#10b981" name="Benchmark" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-muted/30 rounded-lg p-3">
                  <Clock className="h-5 w-5 mr-3 text-healthiq-600" />
                  <div>
                    <h5 className="font-medium">Short-term (3 months)</h5>
                    <p className="text-sm text-muted-foreground">
                      Focus on process improvements
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-healthiq-600" />
                  <div>
                    <h5 className="font-medium">Mid-term (6 months)</h5>
                    <p className="text-sm text-muted-foreground">
                      Staff training and system upgrades
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-healthiq-600" />
                  <div>
                    <h5 className="font-medium">Long-term (12 months)</h5>
                    <p className="text-sm text-muted-foreground">
                      Cultural and structural changes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Benchmarks Met</CardTitle>
            <CardDescription>
              Congratulations! You are meeting or exceeding all benchmarks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-8">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <p>Continue monitoring performance to maintain excellence</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BenchmarkImprovementPlan;
