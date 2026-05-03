import { Phone } from "../data/phones";

export type UpgradeVerdict = "Worth It" | "Marginal" | "Not Worth It";

export interface UpgradeAnalysis {
  performanceDelta: number;
  cameraDelta: number;
  batteryDelta: number;
  displayDelta: number;
  overallDelta: number;
  verdict: UpgradeVerdict;
  explanation: string;
}

function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return Math.round(((to - from) / from) * 100);
}

export function analyzeUpgrade(current: Phone, candidate: Phone): UpgradeAnalysis {
  const performanceDelta = pctChange(current.performance.score, candidate.performance.score);
  const cameraDelta      = pctChange(current.camera.score,      candidate.camera.score);
  const batteryDelta     = pctChange(current.battery.score,     candidate.battery.score);
  const displayDelta     = pctChange(current.displayScore,      candidate.displayScore);
  const overallDelta     = Math.round((performanceDelta + cameraDelta + batteryDelta + displayDelta) / 4);

  let verdict: UpgradeVerdict;
  let explanation: string;

  if (overallDelta >= 20) {
    verdict = "Worth It";
    explanation = `A substantial ${overallDelta}% average improvement over your current phone — you'll feel the difference immediately.`;
  } else if (overallDelta >= 8) {
    verdict = "Marginal";
    explanation = `A modest ${overallDelta}% average gain. Worth considering only if your current phone is ageing or damaged.`;
  } else if (overallDelta >= 0) {
    verdict = "Not Worth It";
    explanation = `Only ${overallDelta}% average improvement. Save your money — the difference won't be noticeable day-to-day.`;
  } else {
    verdict = "Not Worth It";
    explanation = `This phone actually steps back in key areas compared to what you already own. Don't switch.`;
  }

  return { performanceDelta, cameraDelta, batteryDelta, displayDelta, overallDelta, verdict, explanation };
}
