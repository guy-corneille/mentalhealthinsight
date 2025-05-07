
export type BenchmarkMetric = {
  actualValue: number;
  benchmarkValue: number;
  percentile?: number;
  status: 'below' | 'meets' | 'exceeds' | 'above' | 'at';
};

export const calculateBenchmarkStatus = (
  actual: number, 
  benchmark: number, 
  tolerance: number = 5,
  lowerIsBetter: boolean = false
): BenchmarkMetric['status'] => {
  if (lowerIsBetter) {
    if (actual <= benchmark) return 'exceeds';
    if (actual <= benchmark * (1 + tolerance/100)) return 'meets';
    return 'below';
  } else {
    const percentage = (actual / benchmark) * 100;
    if (percentage >= 100 + tolerance) return 'exceeds';
    if (percentage >= 100 - tolerance) return 'meets';
    return 'below';
  }
};

export const calculatePerformanceGap = (actual: number, benchmark: number, lowerIsBetter: boolean = false): number => {
  if (lowerIsBetter) {
    return ((actual - benchmark) / benchmark) * 100;
  }
  return ((benchmark - actual) / benchmark) * 100;
};

export const getPerformanceColor = (status: BenchmarkMetric['status']): string => {
  switch (status) {
    case 'exceeds':
    case 'above':
      return 'text-emerald-600';
    case 'meets':
    case 'at':
      return 'text-amber-500';
    case 'below':
      return 'text-rose-500';
    default:
      return 'text-gray-500';
  }
};

export const getPerformanceBgColor = (status: BenchmarkMetric['status']): string => {
  switch (status) {
    case 'exceeds':
    case 'above':
      return 'bg-emerald-100';
    case 'meets':
    case 'at':
      return 'bg-amber-100';
    case 'below':
      return 'bg-rose-100';
    default:
      return 'bg-gray-100';
  }
};

export const calculateImprovementTarget = (
  current: number,
  benchmark: number,
  timeframeMonths: number = 3,
  lowerIsBetter: boolean = false
) => {
  // If already meeting or exceeding benchmark, maintain current level
  if (lowerIsBetter) {
    if (current <= benchmark) return current;
  } else {
    if (current >= benchmark) return current;
  }
  
  // Calculate gap
  const gap = lowerIsBetter 
    ? current - benchmark 
    : benchmark - current;
  
  // Calculate incremental improvement per month
  // Using a conservative approach (close 20% of gap per month)
  const improvementRate = 0.2;
  const monthlyImprovement = gap * improvementRate;
  
  // Projected value after specified timeframe
  const projectedValue = lowerIsBetter
    ? current - (monthlyImprovement * timeframeMonths)
    : current + (monthlyImprovement * timeframeMonths);
    
  return lowerIsBetter
    ? Math.max(projectedValue, benchmark) // Don't go below benchmark for metrics where lower is better
    : Math.min(projectedValue, benchmark); // Don't go above benchmark for metrics where higher is better
};
