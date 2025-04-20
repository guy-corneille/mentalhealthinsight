
import { useBenchmarks } from "@/hooks/useBenchmarks";
import BenchmarkCard from "./BenchmarkCard";
import { Spinner } from "@/components/ui/spinner";

const BenchmarkOverview = () => {
  const { data: benchmarks, isLoading } = useBenchmarks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!benchmarks) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <BenchmarkCard
        title="Audit Completion"
        metric={benchmarks.auditCompletion}
        description="Rate of completed vs scheduled audits"
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
  );
};

export default BenchmarkOverview;
