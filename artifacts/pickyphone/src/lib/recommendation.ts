/**
 * recommendation.ts — re-exports everything from the canonical scoring module.
 * Kept for backward compatibility with any existing imports.
 */
export type { Priority, UsageType, UserPreferences, Winners, UpgradeVerdict, UpgradeAnalysis } from "./scoring";
export {
  scorePhone, computeMatchScores, computeWinners, findBestMatch,
  generateMatchReason, getBestPhone, analyzeUpgrade,
} from "./scoring";
