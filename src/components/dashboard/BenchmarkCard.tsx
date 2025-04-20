
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
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

export default BenchmarkCard;
