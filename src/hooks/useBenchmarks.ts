
import { useQuery } from "@tanstack/react-query";
import { BenchmarkMetric, calculateBenchmarkStatus } from "@/utils/benchmarkUtils";
import api from "@/services/api";

interface BenchmarkData {
  auditCompletion: BenchmarkMetric;
  documentationQuality: BenchmarkMetric;
  staffPerformance: BenchmarkMetric;
  patientSatisfaction: BenchmarkMetric;
}

export const useBenchmarks = () => {
  return useQuery({
    queryKey: ["benchmarks"],
    queryFn: async (): Promise<BenchmarkData> => {
      // In a real implementation, this would fetch from your API
      // For now, we'll return mock data
      return {
        auditCompletion: {
          actualValue: 85,
          benchmarkValue: 90,
          percentile: 75,
          status: calculateBenchmarkStatus(85, 90)
        },
        documentationQuality: {
          actualValue: 92,
          benchmarkValue: 85,
          percentile: 95,
          status: calculateBenchmarkStatus(92, 85)
        },
        staffPerformance: {
          actualValue: 88,
          benchmarkValue: 85,
          percentile: 80,
          status: calculateBenchmarkStatus(88, 85)
        },
        patientSatisfaction: {
          actualValue: 89,
          benchmarkValue: 90,
          percentile: 85,
          status: calculateBenchmarkStatus(89, 90)
        }
      };
    },
  });
};
