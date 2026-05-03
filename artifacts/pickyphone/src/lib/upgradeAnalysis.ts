/**
 * upgradeAnalysis.ts — re-exports from the canonical scoring module.
 * Kept for backward compatibility with any existing imports.
 */
export type { UpgradeVerdict, UpgradeAnalysis } from "./scoring";
export { analyzeUpgrade } from "./scoring";
