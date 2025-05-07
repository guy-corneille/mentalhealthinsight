
import { useBenchmarking, BenchmarkTarget } from "../hooks/useBenchmarking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const BenchmarkDetails = () => {
  const { toast } = useToast();
  const { benchmarks, performanceGaps, calculateProjection, saveBenchmarkTarget } = useBenchmarking();
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof benchmarks>('auditCompletion');
  const [targetValue, setTargetValue] = useState(95);
  const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days in the future
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!benchmarks || !performanceGaps) {
    return null;
  }

  const currentMetric = benchmarks[selectedMetric];
  const currentGap = performanceGaps[selectedMetric];
  const projection = calculateProjection(selectedMetric, targetValue, targetDate);

  // Generate projection chart data
  const projectionData = projection?.milestones.map(milestone => ({
    day: `Day ${milestone.day}`,
    value: milestone.value
  })) || [];

  // Add current value at day 0
  projectionData.unshift({
    day: "Today",
    value: projection?.current || 0
  });

  // Format friendly names for metrics
  const metricNames = {
    auditCompletion: "Audit Completion Rate",
    documentationQuality: "Documentation Quality",
    staffPerformance: "Staff Performance",
    patientSatisfaction: "Patient Satisfaction"
  };

  const handleSaveTarget = async () => {
    if (!benchmarks) return;
    
    setIsSubmitting(true);
    
    try {
      const target: BenchmarkTarget = {
        metricKey: selectedMetric,
        targetValue,
        targetDate,
        description: `Improve ${metricNames[selectedMetric]} from ${benchmarks[selectedMetric].actualValue.toFixed(1)}% to ${targetValue}% by ${format(targetDate, 'PP')}`
      };
      
      await saveBenchmarkTarget.mutateAsync(target);
      
      toast({
        title: "Target saved",
        description: "Your benchmark target has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save target",
        description: "There was a problem saving your benchmark target.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis">Gap Analysis</TabsTrigger>
          <TabsTrigger value="projection">Improvement Projection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(performanceGaps).map(([key, gap]) => (
              <Card 
                key={key} 
                className={`cursor-pointer ${selectedMetric === key ? 'border-2 border-primary' : ''}`}
                onClick={() => setSelectedMetric(key as keyof typeof benchmarks)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metricNames[key as keyof typeof metricNames]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-xl">{gap.gap.toFixed(1)}% Gap</div>
                  <div className={`text-xs ${
                    gap.priority === 'high' ? 'text-red-500' : 
                    gap.priority === 'medium' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {gap.priority.toUpperCase()} Priority
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {currentGap && (
            <Alert>
              <AlertTitle>Recommendation for {metricNames[selectedMetric]}</AlertTitle>
              <AlertDescription>{currentGap.recommendation}</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="projection" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Set Improvement Target</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Metric</label>
                  <select 
                    className="w-full p-2 border rounded mt-1"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as keyof typeof benchmarks)}
                  >
                    {Object.entries(metricNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Value: {currentMetric.actualValue.toFixed(1)}%</label>
                  <div className="flex items-center gap-2 mt-1">
                    <label className="text-sm font-medium">Target Value:</label>
                    <input 
                      type="number" 
                      className="w-24 p-2 border rounded" 
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      min={currentMetric.actualValue}
                      max={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Date</label>
                  <input 
                    type="date"
                    className="w-full p-2 border rounded mt-1"
                    value={format(targetDate, 'yyyy-MM-dd')}
                    onChange={(e) => setTargetDate(new Date(e.target.value))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <Button 
                  onClick={handleSaveTarget}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Target'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Improvement Projection</CardTitle>
              </CardHeader>
              <CardContent>
                {projection && (
                  <div className="space-y-4">
                    <p className="text-sm">
                      To reach {targetValue}% from current {projection.current.toFixed(1)}% in {projection.daysToTarget} days, 
                      you need a daily improvement of {projection.dailyImprovement.toFixed(3)}%.
                    </p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[
                            Math.floor(projection.current - 5), 
                            Math.ceil(projection.target + 5)
                          ]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6366f1" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Milestones:</h4>
                      {projection.milestones.map((milestone, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>Day {milestone.day}:</span>
                          <span className="font-medium">{milestone.value}% ({milestone.percentComplete}% complete)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenchmarkDetails;
