
export type BenchmarkMetric = {
  actualValue: number;
  benchmarkValue: number;
  percentile?: number;
  status: 'below' | 'meets' | 'exceeds';
};

export const calculateBenchmarkStatus = (
  actual: number, 
  benchmark: number, 
  tolerance: number = 5
): BenchmarkMetric['status'] => {
  const percentage = (actual / benchmark) * 100;
  if (percentage >= 100 + tolerance) return 'exceeds';
  if (percentage >= 100 - tolerance) return 'meets';
  return 'below';
};

export const calculatePerformanceGap = (actual: number, benchmark: number): number => {
  return ((benchmark - actual) / benchmark) * 100;
};
