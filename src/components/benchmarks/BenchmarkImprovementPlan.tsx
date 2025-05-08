
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BenchmarkCategory } from '@/features/benchmarks/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { calculateImprovementTarget } from '@/utils/benchmarkUtils';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface ImprovementArea {
  metricId: string;
  metricName: string;
  facilityValue: number;
  benchmarkValue: number;
  percentDifference: number;
  status: 'above' | 'at' | 'below';
  categoryName: string;
  gap: number;
  trend?: 'improving' | 'steady' | 'declining';
}

interface BenchmarkImprovementPlanProps {
  improvementAreas: ImprovementArea[];
  categories: BenchmarkCategory[];
}

const BenchmarkImprovementPlan: React.FC<BenchmarkImprovementPlanProps> = ({ 
  improvementAreas, 
  categories 
}) => {
  if (!improvementAreas || improvementAreas.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
        <h3 className="text-xl font-semibold mb-2">All Benchmarks Met</h3>
        <p className="text-muted-foreground">
          Congratulations! All performance metrics are meeting or exceeding their benchmarks.
        </p>
      </div>
    );
  }

  // Add implementation guidance for each metric
  const areasWithGuidance = improvementAreas.map(area => {
    let guidance = '';
    let timeframe = 'medium'; // default
    let priority = 'medium'; // default

    // Assign priority based on gap size
    if (area.gap > 25) {
      priority = 'high';
    } else if (area.gap < 10) {
      priority = 'low';
    }

    // Determine timeframe based on gap and trend
    if (area.trend === 'improving' || area.gap < 10) {
      timeframe = 'long';
    } else if (area.trend === 'declining' || area.gap > 25) {
      timeframe = 'short';
    }

    // Generate metric-specific guidance
    if (area.metricId.includes('assessment-completion')) {
      guidance = 'Implement reminder systems and streamline the assessment process to ensure timely completion.';
    } else if (area.metricId.includes('documentation')) {
      guidance = 'Provide staff training on documentation standards and implement quality checks.';
    } else if (area.metricId.includes('audit')) {
      guidance = 'Establish a regular audit schedule and allocate dedicated resources to ensure completion.';
    } else if (area.metricId.includes('compliance')) {
      guidance = 'Review compliance requirements and implement process improvements to address gaps.';
    } else if (area.metricId.includes('critical-findings')) {
      guidance = 'Create an action plan to address critical findings and prevent recurrence.';
    } else {
      guidance = 'Analyze the root causes of performance gaps and develop targeted improvement strategies.';
    }
    
    return {
      ...area,
      guidance,
      timeframe,
      priority,
      targetValue: calculateImprovementTarget(
        area.facilityValue,
        area.benchmarkValue,
        timeframe === 'short' ? 1 : timeframe === 'medium' ? 3 : 6,
        area.metricId.includes('critical-findings') // Lower is better for critical findings
      )
    };
  });
  
  // Sort by priority (high to low)
  const sortedAreas = [...areasWithGuidance].sort((a, b) => {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return (
    <div className="space-y-6">
      <div className="bg-muted p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Improvement Plan Overview</h3>
        <p className="text-muted-foreground mb-4">
          This plan identifies {improvementAreas.length} metrics that require attention to meet benchmark targets.
          Focus on high priority items for maximum impact.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-white rounded-md shadow-sm">
            <div className="font-semibold text-amber-600 flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              High Priority
            </div>
            <div className="text-2xl font-bold">
              {sortedAreas.filter(a => a.priority === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">metrics requiring immediate attention</div>
          </div>
          
          <div className="p-4 bg-white rounded-md shadow-sm">
            <div className="font-semibold text-blue-600 flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Improvement Timeline
            </div>
            <div className="text-2xl font-bold">
              3-6
            </div>
            <div className="text-sm text-muted-foreground">months to reach benchmarks</div>
          </div>
          
          <div className="p-4 bg-white rounded-md shadow-sm">
            <div className="font-semibold text-healthiq-600 flex items-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4" />
              Average Gap
            </div>
            <div className="text-2xl font-bold">
              {Math.round(sortedAreas.reduce((sum, area) => sum + area.gap, 0) / sortedAreas.length)}%
            </div>
            <div className="text-sm text-muted-foreground">below benchmark targets</div>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Improvement Actions</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {sortedAreas.map((area) => {
          // Calculate color for priority
          const priorityColor = 
            area.priority === 'high' ? 'bg-rose-100 text-rose-700' :
            area.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
            'bg-emerald-100 text-emerald-700';
          
          // Calculate timeframe text and color
          const timeframeText = 
            area.timeframe === 'short' ? '1 month' :
            area.timeframe === 'medium' ? '3 months' : 
            '6 months';
          
          return (
            <Card key={area.metricId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{area.metricName}</CardTitle>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor}`}>
                        {area.priority === 'high' ? 'High Priority' : 
                         area.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                      </span>
                    </div>
                    <CardDescription>
                      {area.categoryName} · Gap: {area.gap.toFixed(1)}%
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">Target Timeline</div>
                    <div className="text-sm text-muted-foreground">{timeframeText}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pb-2">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Current: {area.facilityValue.toFixed(1)}%</span>
                      <span>Benchmark: {area.benchmarkValue}%</span>
                    </div>
                    <Progress 
                      value={(area.facilityValue / area.benchmarkValue) * 100} 
                      className="h-2"
                      // For inverse metrics (like critical findings), invert the progress calculation
                      indicator={area.metricId.includes('critical-findings') ? 'negative' : 'positive'}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Target:</span>
                    <span className="font-bold text-healthiq-700">
                      {area.targetValue.toFixed(1)}%
                    </span>
                    <ArrowUp className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">Implementation Guidance:</h4>
                  <p className="text-sm text-muted-foreground">
                    {area.guidance}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Root Cause Analysis:</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Identify process bottlenecks</li>
                      <li>Review resource allocation</li>
                      <li>Evaluate staff training needs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Key Actions:</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Implement regular monitoring</li>
                      <li>Set incremental improvement goals</li>
                      <li>Review progress monthly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Create Improvement Task</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BenchmarkImprovementPlan;
