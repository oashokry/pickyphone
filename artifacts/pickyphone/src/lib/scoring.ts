/**
 * scoring.ts — single source of truth for all ranking & upgrade math.
 * Pure functions only; no React, no side-effects.
 */
import { Phone } from "../data/phones";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Priority = "camera" | "performance" | "battery" | "display" | "price" | "balanced";
export type UsageType = "Gaming" | "Casual" | "Work" | "Photography" | "Mixed";
export type UpgradeVerdict = "Worth It" | "Marginal" | "Not Worth It";

export interface UserPreferences {
  budget: [number, number];
  usageType: UsageType;
  priority: Priority;
}

export interface Winners {
  price: string;
  displayScore: string;
  cameraScore: string;
  performanceScore: string;
  batteryScore: string;
}

export interface UpgradeAnalysis {
  performanceDelta: number;
  cameraDelta: number;
  batteryDelta: number;
  displayDelta: number;
  overallDelta: number;
  verdict: UpgradeVerdict;
  explanation: string;
}

// ─── Match scoring ─────────────────────────────────────────────────────────────

interface Weights {
  camera: number;
  performance: number;
  battery: number;
  display: number;
  price: number;
}

const BASE_WEIGHTS: Record<UsageType, Weights> = {
  Gaming:      { performance: 0.38, display: 0.27, battery: 0.20, camera: 0.10, price: 0.05 },
  Casual:      { battery: 0.28,     display: 0.25, price: 0.22,   camera: 0.18, performance: 0.07 },
  Work:        { performance: 0.33, battery: 0.25, display: 0.22, price: 0.12,  camera: 0.08 },
  Photography: { camera: 0.50,      display: 0.20, performance: 0.14, battery: 0.11, price: 0.05 },
  Mixed:       { camera: 0.20,      performance: 0.20, battery: 0.20, display: 0.20, price: 0.20 },
};

const PRIORITY_KEY: Record<Priority, keyof Weights | null> = {
  camera: "camera", performance: "performance", battery: "battery",
  display: "display", price: "price", balanced: null,
};

function applyPriorityBoost(base: Weights, priority: Priority): Weights {
  const key = PRIORITY_KEY[priority];
  if (!key) return base;
  const BOOST = 0.15;
  const w = { ...base };
  const others = (Object.keys(w) as Array<keyof Weights>).filter(k => k !== key);
  const cut = BOOST / others.length;
  w[key] = Math.min(1, w[key] + BOOST);
  others.forEach(k => { w[k] = Math.max(0, w[k] - cut); });
  const total = (Object.values(w) as number[]).reduce((a, b) => a + b, 0);
  (Object.keys(w) as Array<keyof Weights>).forEach(k => { w[k] = w[k] / total; });
  return w;
}

function budgetScore(price: number, budget: [number, number]): number {
  const [lo, hi] = budget;
  if (price >= lo && price <= hi) return 100;
  if (price > hi) return Math.max(0, Math.round(100 - ((price - hi) / hi) * 160));
  return Math.max(65, Math.round(100 - ((lo - price) / Math.max(lo, 1)) * 40));
}

/** Score a phone 0-99 against user preferences. */
export function scorePhone(phone: Phone, prefs: UserPreferences): number {
  const w = applyPriorityBoost(BASE_WEIGHTS[prefs.usageType], prefs.priority);
  const raw =
    phone.camera.score      * w.camera +
    phone.performance.score * w.performance +
    phone.battery.score     * w.battery +
    phone.displayScore      * w.display +
    budgetScore(phone.price, prefs.budget) * w.price;
  return Math.min(99, Math.round(raw));
}

/** Compute match scores for every phone in a list. O(n). */
export function computeMatchScores(phones: Phone[], prefs: UserPreferences): Record<string, number> {
  return Object.fromEntries(phones.map(p => [p.id, scorePhone(p, prefs)]));
}

/** Find the phone with the highest match score. */
export function findBestMatch(phones: Phone[], scores: Record<string, number>): Phone {
  return phones.reduce((best, p) => scores[p.id] > scores[best.id] ? p : best, phones[0]);
}

/** Human-readable explanation for a match score. */
export function generateMatchReason(phone: Phone, prefs: UserPreferences, pct: number): string {
  const prefix = pct >= 90 ? "Perfect fit" : pct >= 75 ? "Great match" : "Solid option";
  const reasons: Record<UsageType, string> = {
    Gaming:      `The ${phone.performance.chipset} and ${phone.display.refreshRate} display deliver a top-tier gaming experience.`,
    Casual:      `Smooth, dependable, and long-lasting — exactly what you need every day.`,
    Work:        `The ${phone.performance.chipset} handles heavy multitasking without breaking a sweat.`,
    Photography: `Its ${phone.camera.main} main sensor sets the standard for mobile photography.`,
    Mixed:       `Balanced across every category — no weaknesses, just versatility.`,
  };
  return `${prefix} for ${prefs.usageType.toLowerCase()} use. ${reasons[prefs.usageType]}`;
}

// ─── Spec winners ──────────────────────────────────────────────────────────────

/** Compute the winner ID for each scored spec category. */
export function computeWinners(phones: Phone[]): Winners {
  if (phones.length === 0) return { price: "", displayScore: "", cameraScore: "", performanceScore: "", batteryScore: "" };
  const best = <T>(arr: Phone[], fn: (p: Phone) => T, dir: "max" | "min"): string =>
    arr.reduce((w, p) => (dir === "max" ? fn(p) > fn(w) : fn(p) < fn(w)) ? p : w, arr[0]).id;
  return {
    price:            best(phones, p => p.price,             "min"),
    displayScore:     best(phones, p => p.displayScore,      "max"),
    cameraScore:      best(phones, p => p.camera.score,      "max"),
    performanceScore: best(phones, p => p.performance.score, "max"),
    batteryScore:     best(phones, p => p.battery.score,     "max"),
  };
}

// ─── Recommendation ────────────────────────────────────────────────────────────

/** Pick the best phone by a named priority with a plain-English reason. */
export function getBestPhone(phones: Phone[], priority: Priority): { phone: Phone; reason: string } {
  if (phones.length === 0) throw new Error("No phones provided");
  if (phones.length === 1) return { phone: phones[0], reason: "Only one option — but sometimes that's all you need." };

  const pick = (fn: (a: Phone, b: Phone) => Phone): Phone => phones.reduce(fn);

  switch (priority) {
    case "camera": {
      const p = pick((a, b) => b.camera.score > a.camera.score ? b : a);
      return { phone: p, reason: `Tops the camera charts with a score of ${p.camera.score}/100 — every shot counts.` };
    }
    case "performance": {
      const p = pick((a, b) => b.performance.score > a.performance.score ? b : a);
      return { phone: p, reason: `Fastest of the group. The ${p.performance.chipset} leaves nothing waiting.` };
    }
    case "battery": {
      const p = pick((a, b) => b.battery.score > a.battery.score ? b : a);
      return { phone: p, reason: `Best battery life in the lineup — ${p.battery.capacity} with rapid charging included.` };
    }
    case "display": {
      const p = pick((a, b) => b.displayScore > a.displayScore ? b : a);
      return { phone: p, reason: `The best screen here — ${p.display.type} at ${p.display.refreshRate}, smooth and vivid.` };
    }
    case "price": {
      const p = pick((a, b) => b.price < a.price ? b : a);
      return { phone: p, reason: `The smartest spend at $${p.price.toLocaleString()} — great value without compromise.` };
    }
    default: {
      const p = pick((a, b) => {
        const sa = (a.camera.score + a.performance.score + a.battery.score + a.displayScore) / 4;
        const sb = (b.camera.score + b.performance.score + b.battery.score + b.displayScore) / 4;
        return sb > sa ? b : a;
      });
      return { phone: p, reason: "The most well-rounded device here — strong everywhere, weak nowhere." };
    }
  }
}

// ─── Upgrade analysis ──────────────────────────────────────────────────────────

function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return Math.round(((to - from) / from) * 100);
}

/** Compute how much `candidate` improves on `current` across key categories. */
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
    explanation = `A ${overallDelta}% average improvement — you'll feel the difference from day one.`;
  } else if (overallDelta >= 8) {
    verdict = "Marginal";
    explanation = `About ${overallDelta}% better overall. Only upgrade if your current phone is struggling.`;
  } else if (overallDelta >= 0) {
    verdict = "Not Worth It";
    explanation = `Just ${overallDelta}% ahead. The gains are too small to justify the spend.`;
  } else {
    verdict = "Not Worth It";
    explanation = `This phone is actually weaker than yours in key areas. Don't switch.`;
  }

  return { performanceDelta, cameraDelta, batteryDelta, displayDelta, overallDelta, verdict, explanation };
}
