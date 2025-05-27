
import { useQuery } from "@tanstack/react-query";
import { BenchmarkMetric, calculateBenchmarkStatus } from "@/utils/benchmarkUtils";
import api from "@/services/api";

interface BenchmarkData {
  auditCompletion: BenchmarkMetric;
  documentationQuality: BenchmarkMetric;
  staffPerformance: BenchmarkMetric;
  patientSatisfaction: BenchmarkMetric;
}

interface AuditStats {
  completed: number;
  scheduled: number;
  incomplete: number;
  total: number;
}

export const useBenchmarks = () => {
  return useQuery({
    queryKey: ["benchmarks"],
    queryFn: async (): Promise<BenchmarkData> => {
      try {
        // Fetch real audit statistics
        const auditStats = await api.get<AuditStats>('/api/reports/audit-statistics/');
        
        const completionRate = auditStats.completed / auditStats.total * 100;
        const benchmarkValue = 90; // Industry standard benchmark

        return {
          auditCompletion: {
            actualValue: completionRate,
            benchmarkValue: benchmarkValue,
            percentile: 75, // This would ideally come from comparing to other facilities
            status: calculateBenchmarkStatus(completionRate, benchmarkValue)
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
      } catch (error) {
        console.error("Error fetching benchmark data:", error);
        throw error;
      }
    },
  });
};
