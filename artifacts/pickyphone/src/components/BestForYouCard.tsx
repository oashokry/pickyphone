import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Phone } from "@/data/phones";
import { UsageType } from "@/lib/recommendation";
import PhoneIllustration from "./PhoneIllustration";

interface Props {
  phone: Phone;
  matchPct: number;
  reason: string;
  usageType: UsageType;
  budget: [number, number];
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current = Math.min(target, Math.round(increment * frame));
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count}</>;
}

const USAGE_ICONS: Record<UsageType, string> = {
  Gaming: "🎮",
  Casual: "☀️",
  Work: "💼",
  Photography: "📷",
  Mixed: "⚡",
};

export default function BestForYouCard({ phone, matchPct, reason, usageType, budget }: Props) {
  const ringColor =
    matchPct >= 90 ? "text-primary" :
    matchPct >= 75 ? "text-amber-400" :
    "text-orange-500";

  const badgeLabel =
    matchPct >= 90 ? "Perfect Match" :
    matchPct >= 75 ? "Great Match" :
    "Good Match";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card mt-10"
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
      />

      {/* Gold top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <div className="p-6 md:p-10">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Best For You</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {USAGE_ICONS[usageType]} {usageType} · Budget ${budget[0].toLocaleString()}–${budget[1].toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Phone illustration */}
          <div className="w-28 md:w-36 shrink-0">
            <PhoneIllustration brand={phone.brand} name={phone.name} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-1">{phone.brand}</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">{phone.name}</h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-6">{reason}</p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
              <div className="px-3 py-1.5 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Price </span>
                <span className="font-semibold">${phone.price.toLocaleString()}</span>
              </div>
              <div className="px-3 py-1.5 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Camera </span>
                <span className="font-semibold">{phone.camera.score}/100</span>
              </div>
              <div className="px-3 py-1.5 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Battery </span>
                <span className="font-semibold">{phone.battery.score}/100</span>
              </div>
              <div className="px-3 py-1.5 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Performance </span>
                <span className="font-semibold">{phone.performance.score}/100</span>
              </div>
            </div>
          </div>

          {/* Match % ring */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor"
                  strokeWidth="8" className="text-border" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="currentColor" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - matchPct / 100)}
                  className={ringColor}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - matchPct / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold leading-none ${ringColor}`}>
                  <AnimatedCounter target={matchPct} />%
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">match</span>
              </div>
            </div>
            <span className={`text-xs font-bold ${ringColor}`}>{badgeLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
