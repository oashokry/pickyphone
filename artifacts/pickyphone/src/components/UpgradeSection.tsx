import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Phone } from "@/data/phones";
import { analyzeUpgrade, UpgradeVerdict } from "@/lib/upgradeAnalysis";
import PhoneIllustration from "./PhoneIllustration";

interface Props {
  currentPhone: Phone;
  candidates: Phone[];
}

function DeltaBar({ label, delta, delay }: { label: string; delta: number; delay: number }) {
  const pos = delta > 2;
  const neg = delta < -2;
  const barWidth = Math.min(Math.abs(delta * 1.5), 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className={`font-bold flex items-center gap-1 ${pos ? "text-emerald-400" : neg ? "text-red-400" : "text-muted-foreground"}`}>
          {pos ? <TrendingUp className="w-3 h-3" /> : neg ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {pos ? "+" : ""}{delta}%
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay }}
          className={`h-full rounded-full ${pos ? "bg-emerald-400" : neg ? "bg-red-400" : "bg-muted-foreground/40"}`}
        />
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: UpgradeVerdict }) {
  const config = {
    "Worth It":     { icon: CheckCircle2, color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
    "Marginal":     { icon: AlertCircle,  color: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
    "Not Worth It": { icon: XCircle,      color: "text-red-400 border-red-400/40 bg-red-400/10" },
  };
  const { icon: Icon, color } = config[verdict];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {verdict}
    </span>
  );
}

function UpgradeCard({ currentPhone, candidate, index }: { currentPhone: Phone; candidate: Phone; index: number }) {
  const analysis = analyzeUpgrade(currentPhone, candidate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 + 0.2, duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Phone header */}
      <div className="flex items-center gap-4">
        <div className="w-10 shrink-0">
          <PhoneIllustration brand={candidate.brand} name={candidate.name} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-widest truncate">{candidate.brand}</p>
          <p className="font-serif font-bold truncate">{candidate.name}</p>
        </div>
        <VerdictBadge verdict={analysis.verdict} />
      </div>

      {/* Delta bars */}
      <div className="space-y-3">
        <DeltaBar label="Performance" delta={analysis.performanceDelta} delay={index * 0.12 + 0.35} />
        <DeltaBar label="Camera"      delta={analysis.cameraDelta}      delay={index * 0.12 + 0.45} />
        <DeltaBar label="Battery"     delta={analysis.batteryDelta}     delay={index * 0.12 + 0.55} />
        <DeltaBar label="Display"     delta={analysis.displayDelta}     delay={index * 0.12 + 0.65} />
      </div>

      {/* Overall */}
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Overall Improvement</span>
        <span className={`text-xl font-bold ${analysis.overallDelta >= 20 ? "text-emerald-400" : analysis.overallDelta >= 8 ? "text-amber-400" : "text-red-400"}`}>
          {analysis.overallDelta > 0 ? "+" : ""}{analysis.overallDelta}%
        </span>
      </div>

      {/* Explanation */}
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
        {analysis.explanation}
      </p>
    </motion.div>
  );
}

export default function UpgradeSection({ currentPhone, candidates }: Props) {
  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-6">
        <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">
          Is It Worth Upgrading?
        </h2>
      </div>

      {/* Current phone badge */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-card/60 border border-border/60 rounded-xl w-fit">
        <div className="w-8 shrink-0">
          <PhoneIllustration brand={currentPhone.brand} name={currentPhone.name} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Current Phone</p>
          <p className="font-semibold text-sm">{currentPhone.brand} {currentPhone.name}</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {candidates.map((c, i) => (
          <UpgradeCard key={c.id} currentPhone={currentPhone} candidate={c} index={i} />
        ))}
      </div>
    </section>
  );
}
