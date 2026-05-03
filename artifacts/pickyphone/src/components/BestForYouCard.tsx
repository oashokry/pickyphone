import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Phone } from "@/data/phones";
import { UsageType } from "@/lib/scoring";
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
    const steps = 60;
    const inc = target / steps;
    let frame = 0;
    const t = setInterval(() => {
      frame++;
      setCount(Math.min(target, Math.round(inc * frame)));
      if (frame >= steps) clearInterval(t);
    }, 1200 / steps);
    return () => clearInterval(t);
  }, [target]);
  return <>{count}</>;
}

const USAGE_LABEL: Record<UsageType, string> = {
  Gaming: "Gaming", Casual: "Casual", Work: "Work", Photography: "Photography", Mixed: "Mixed",
};

export default function BestForYouCard({ phone, matchPct, reason, usageType, budget }: Props) {
  const ringColor =
    matchPct >= 90 ? "hsl(43 65% 53%)" :
    matchPct >= 75 ? "#f59e0b" :
                     "#f97316";

  const badgeLabel =
    matchPct >= 90 ? "Perfect Match" :
    matchPct >= 75 ? "Great Match" :
                     "Good Match";

  const R = 42;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - matchPct / 100);

  const statChips = [
    { label: "Camera",      value: `${phone.camera.score}/100` },
    { label: "Performance", value: `${phone.performance.score}/100` },
    { label: "Battery",     value: `${phone.battery.score}/100` },
    { label: "Price",       value: `$${phone.price.toLocaleString()}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-primary/35
        bg-gradient-to-br from-card via-card to-primary/5
        shadow-[0_0_50px_-15px_hsl(var(--primary)/0.4)] mt-8 mb-8"
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/7 to-transparent pointer-events-none"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 7, ease: "easeInOut" }}
      />

      {/* Gold top bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

      <div className="p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Best For You</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {USAGE_LABEL[usageType]} · ${budget[0].toLocaleString()}–${budget[1].toLocaleString()}
          </span>
        </div>

        {/* Body: stacks on mobile, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">

          {/* Illustration */}
          <div className="w-24 md:w-32 shrink-0">
            <PhoneIllustration brand={phone.brand} name={phone.name} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="text-[10px] font-bold tracking-[0.22em] text-primary/70 uppercase mb-1">
              {phone.brand}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight">
              {phone.name}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mb-5">
              {reason}
            </p>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {statChips.map(({ label, value }) => (
                <div key={label} className="px-3 py-1.5 bg-background/80 rounded-lg border border-border/60 text-xs">
                  <span className="text-muted-foreground">{label} </span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match ring */}
          <div className="shrink-0 flex flex-col items-center gap-1.5">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={R} fill="none" stroke="hsl(0 0% 16%)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r={R} fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  initial={{ strokeDashoffset: CIRC }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold leading-none" style={{ color: ringColor }}>
                  <AnimatedCounter target={matchPct} />%
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 tracking-wider">match</span>
              </div>
            </div>
            <span className="text-xs font-bold" style={{ color: ringColor }}>{badgeLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
