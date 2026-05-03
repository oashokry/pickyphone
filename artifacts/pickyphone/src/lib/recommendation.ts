import { Phone } from "../data/phones";

export type Priority = "camera" | "performance" | "battery" | "display" | "price" | "balanced";
export type UsageType = "Gaming" | "Casual" | "Work" | "Photography" | "Mixed";

export interface UserPreferences {
  budget: [number, number];
  usageType: UsageType;
  priority: Priority;
}

interface Weights {
  camera: number;
  performance: number;
  battery: number;
  display: number;
  price: number;
}

const BASE_WEIGHTS: Record<UsageType, Weights> = {
  Gaming:      { performance: 0.38, display: 0.27, battery: 0.20, camera: 0.10, price: 0.05 },
  Casual:      { battery: 0.28, display: 0.25, price: 0.22, camera: 0.18, performance: 0.07 },
  Work:        { performance: 0.33, battery: 0.25, display: 0.22, price: 0.12, camera: 0.08 },
  Photography: { camera: 0.50, display: 0.20, performance: 0.14, battery: 0.11, price: 0.05 },
  Mixed:       { camera: 0.20, performance: 0.20, battery: 0.20, display: 0.20, price: 0.20 },
};

const PRIORITY_KEY: Record<Priority, keyof Weights | null> = {
  camera: "camera",
  performance: "performance",
  battery: "battery",
  display: "display",
  price: "price",
  balanced: null,
};

function applyPriorityBoost(base: Weights, priority: Priority): Weights {
  const key = PRIORITY_KEY[priority];
  if (!key) return base;

  const BOOST = 0.15;
  const w = { ...base };
  const otherKeys = (Object.keys(w) as Array<keyof Weights>).filter(k => k !== key);
  const reduction = BOOST / otherKeys.length;

  w[key] = Math.min(1, w[key] + BOOST);
  otherKeys.forEach(k => { w[k] = Math.max(0, w[k] - reduction); });

  // Re-normalise to exactly 1
  const total = (Object.values(w) as number[]).reduce((a, b) => a + b, 0);
  (Object.keys(w) as Array<keyof Weights>).forEach(k => { w[k] = w[k] / total; });
  return w;
}

function budgetScore(price: number, budget: [number, number]): number {
  const [lo, hi] = budget;
  if (price >= lo && price <= hi) return 100;
  if (price > hi) {
    const overpct = (price - hi) / hi;
    return Math.max(0, Math.round(100 - overpct * 160));
  }
  // Under budget: mild penalty only when way below the floor
  const underpct = (lo - price) / Math.max(lo, 1);
  return Math.max(65, Math.round(100 - underpct * 40));
}

export function scorePhone(phone: Phone, prefs: UserPreferences): number {
  const weights = applyPriorityBoost(BASE_WEIGHTS[prefs.usageType], prefs.priority);
  const raw =
    phone.camera.score      * weights.camera +
    phone.performance.score * weights.performance +
    phone.battery.score     * weights.battery +
    phone.displayScore      * weights.display +
    budgetScore(phone.price, prefs.budget) * weights.price;
  return Math.min(99, Math.round(raw));
}

export function generateMatchReason(phone: Phone, prefs: UserPreferences, pct: number): string {
  const prefix = pct >= 90 ? "Perfect fit" : pct >= 75 ? "Great match" : "Decent option";

  const usageReasons: Record<UsageType, string> = {
    Gaming:      `Its ${phone.performance.chipset} and ${phone.display.refreshRate} display make it a gaming powerhouse.`,
    Casual:      `A smooth daily driver with solid battery and a great everyday camera.`,
    Work:        `The ${phone.performance.chipset} handles multitasking effortlessly.`,
    Photography: `Its ${phone.camera.main} main sensor produces exceptional photos.`,
    Mixed:       `Well-rounded across all categories for any lifestyle.`,
  };

  return `${prefix} for ${prefs.usageType.toLowerCase()} use. ${usageReasons[prefs.usageType]}`;
}

// Legacy helper kept for backward compat
export function getBestPhone(phones: Phone[], priority: Priority): { phone: Phone; reason: string } {
  if (phones.length === 0) throw new Error("No phones provided");
  if (phones.length === 1) return { phone: phones[0], reason: "The only choice is always the best choice." };

  let best = phones[0];
  switch (priority) {
    case "camera":
      best = phones.reduce((p, c) => c.camera.score > p.camera.score ? c : p);
      return { phone: best, reason: `Best overall camera with a score of ${best.camera.score}.` };
    case "performance":
      best = phones.reduce((p, c) => c.performance.score > p.performance.score ? c : p);
      return { phone: best, reason: `Unmatched speed powered by the ${best.performance.chipset}.` };
    case "battery":
      best = phones.reduce((p, c) => c.battery.score > p.battery.score ? c : p);
      return { phone: best, reason: `Class-leading endurance with ${best.battery.capacity} and fast charging.` };
    case "display":
      best = phones.reduce((p, c) => c.displayScore > p.displayScore ? c : p);
      return { phone: best, reason: `Stunning ${best.display.type} at ${best.display.refreshRate}.` };
    case "price":
      best = phones.reduce((p, c) => c.price < p.price ? c : p);
      return { phone: best, reason: `Best value at $${best.price}.` };
    case "balanced":
    default:
      best = phones.reduce((p, c) => {
        const ps = (p.camera.score + p.performance.score + p.battery.score + p.displayScore) / 4;
        const cs = (c.camera.score + c.performance.score + c.battery.score + c.displayScore) / 4;
        return cs > ps ? c : p;
      });
      return { phone: best, reason: "Optimal balance of performance, features, and everyday reliability." };
  }
}
