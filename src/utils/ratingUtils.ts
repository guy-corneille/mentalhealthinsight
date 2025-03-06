
export type Rating = "pass" | "high-partial" | "partial" | "low-partial" | "fail" | "not-applicable" | "not-rated";

export const getRatingValue = (rating: Rating): number => {
  switch (rating) {
    case "pass": return 1;
    case "high-partial": return 0.75;
    case "partial": return 0.5;
    case "low-partial": return 0.25;
    case "fail": return 0;
    case "not-applicable": return -1; // Special value to indicate this shouldn't be counted
    case "not-rated": return 0;
    default: return 0;
  }
};

export const getRatingFromScore = (score: number): Rating => {
  if (score >= 80) return "pass";
  if (score >= 65) return "high-partial";
  if (score >= 40) return "partial";
  if (score >= 20) return "low-partial";
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

/**
 * Calculate a weighted score for items that can be marked as not applicable
 */
export const calculateWeightedScoreWithExclusions = (
  items: Array<{ weight: number; rating: Rating }>,
): number => {
  let totalScore = 0;
  let totalWeight = 0;

  items.forEach(item => {
    // Skip items that are marked as not applicable
    if (item.rating === "not-applicable") {
      return;
    }
    
    const ratingValue = getRatingValue(item.rating);
    totalScore += (ratingValue * item.weight);
    totalWeight += item.weight;
  });

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
};
