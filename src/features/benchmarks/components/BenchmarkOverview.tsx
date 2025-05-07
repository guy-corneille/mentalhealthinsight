
import { useBenchmarking } from "../hooks/useBenchmarking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BenchmarkMetric } from "@/utils/benchmarkUtils";

interface BenchmarkCardProps {
  title: string;
  metric: BenchmarkMetric;
  description?: string;
}

const BenchmarkCard = ({ title, metric, description }: BenchmarkCardProps) => {
  const statusColors = {
    below: "text-red-500",
    meets: "text-yellow-500",
    exceeds: "text-green-500"
  };

  const StatusIcon = {
    below: ArrowDown,
    meets: Minus,
    exceeds: ArrowUp
  }[metric.status];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <StatusIcon className={`h-4 w-4 ${statusColors[metric.status]}`} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-bold">
            {metric.actualValue.toFixed(1)}%
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              Benchmark: {metric.benchmarkValue}%
            </span>
            {metric.percentile && (
              <span className="text-xs text-muted-foreground">
                ({metric.percentile}th percentile)
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BenchmarkOverview = () => {
  const { 
    benchmarks, 
    isLoading, 
    error,
    selectedTimeframe,
    setSelectedTimeframe 
  } = useBenchmarking();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !benchmarks) {
    return (
      <div className="bg-muted p-4 rounded-md text-center">
        <p>Unable to load benchmark data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Performance Benchmarks</h3>
        <Select value={selectedTimeframe} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setSelectedTimeframe(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BenchmarkCard
          title="Audit Completion"
          metric={benchmarks.auditCompletion}
          description="Completed vs scheduled audits"
        />
        <BenchmarkCard
          title="Documentation Quality"
          metric={benchmarks.documentationQuality}
          description="Assessment documentation completeness"
        />
        <BenchmarkCard
          title="Staff Performance"
          metric={benchmarks.staffPerformance}
          description="Overall staff evaluation scores"
        />
        <BenchmarkCard
          title="Patient Satisfaction"
          metric={benchmarks.patientSatisfaction}
          description="Patient feedback scores"
        />
      </div>
    </div>
  );
};

export default BenchmarkOverview;
