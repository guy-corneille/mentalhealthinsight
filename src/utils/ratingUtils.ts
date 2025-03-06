
export type Rating = "pass" | "partial" | "fail" | "not-rated";

export const getRatingValue = (rating: Rating): number => {
  switch (rating) {
    case "pass": return 1;
    case "partial": return 0.5;
    case "fail": return 0;
    default: return 0;
  }
};

export const getRatingFromScore = (score: number): Rating => {
  if (score >= 80) return "pass";
  if (score >= 40) return "partial";
  return "fail";
};

export const calculateWeightedScore = (
  items: Array<{ weight: number; score: number }>,
): number => {
  let totalScore = 0;
  let totalWeight = 0;

  items.forEach(item => {
    totalScore += (item.score * item.weight);
    totalWeight += item.weight;
  });

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
};
