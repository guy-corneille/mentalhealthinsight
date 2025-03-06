
import { UserRole } from '@/contexts/AuthContext';

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

/**
 * Returns whether a user role has access to a specific criteria type
 */
export const canAccessCriteriaType = (role: UserRole, criteriaType: 'assessment' | 'audit'): boolean => {
  switch (role) {
    case 'superuser':
    case 'admin':
      return true; // Can access all criteria types
    case 'auditor':
      return criteriaType === 'audit'; // Can only access audit criteria
    case 'clinician':
      return criteriaType === 'assessment'; // Can only access assessment criteria
    case 'viewer':
      return false; // Cannot modify any criteria
    default:
      return false;
  }
};

/**
 * Adjust the displayed score based on user role for reporting purposes
 */
export const getAdjustedScoreForRole = (
  score: number, 
  role: UserRole, 
  criteriaType: 'assessment' | 'audit'
): number => {
  // Some organizations may want to adjust displayed scores based on role
  // This is a placeholder for such logic
  return score;
};
