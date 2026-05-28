import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Phone } from "@/data/phones";
import { analyzeUpgrade, UpgradeVerdict } from "@/lib/scoring";
import PhoneIllustration from "./PhoneIllustration";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  currentPhone: Phone;
  candidates: Phone[];
}

function DeltaBar({ label, description, delta, delay }: { label: string; description: string; delta: number; delay: number }) {
  const pos = delta > 2;
  const neg = delta < -2;
  const barWidth = Math.min(Math.abs(delta * 1.5), 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-start text-xs gap-2">
        <div>
          <span className="text-muted-foreground font-medium">{label}</span>
          <p className="text-[10px] text-muted-foreground/50 leading-tight mt-0.5">{description}</p>
        </div>
        <span className={`font-bold flex items-center gap-1 shrink-0 mt-0.5 ${pos ? "text-emerald-400" : neg ? "text-red-400" : "text-muted-foreground"}`}>
          {pos
            ? <TrendingUp className="w-3 h-3" />
            : neg
              ? <TrendingDown className="w-3 h-3" />
              : <Minus className="w-3 h-3" />}
          {pos ? "+" : ""}{delta}%
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
          className={`h-full rounded-full ${pos ? "bg-emerald-400" : neg ? "bg-red-400" : "bg-muted-foreground/30"}`}
        />
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: UpgradeVerdict }) {
  const { t } = useLanguage();
  const verdictLabel: Record<UpgradeVerdict, string> = {
    "Worth It": t.worthIt,
    "Marginal": t.marginal,
    "Not Worth It": t.notWorthIt,
  };
  const MAP: Record<UpgradeVerdict, { icon: typeof CheckCircle2; cls: string }> = {
    "Worth It":     { icon: CheckCircle2, cls: "text-emerald-400 border-emerald-400/35 bg-emerald-400/10" },
    "Marginal":     { icon: AlertCircle,  cls: "text-amber-400 border-amber-400/35 bg-amber-400/10" },
    "Not Worth It": { icon: XCircle,      cls: "text-red-400 border-red-400/35 bg-red-400/10" },
  };
  const { icon: Icon, cls } = MAP[verdict];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold shrink-0 ${cls}`}>
      <Icon className="w-3 h-3" />
      {verdictLabel[verdict]}
    </span>
  );
}

function UpgradeCard({ currentPhone, candidate, index }: { currentPhone: Phone; candidate: Phone; index: number }) {
  const { t } = useLanguage();
  const a = analyzeUpgrade(currentPhone, candidate);
  const overallColor = a.overallDelta >= 20 ? "text-emerald-400" : a.overallDelta >= 8 ? "text-amber-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4
        hover:border-border/80 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 shrink-0">
          <PhoneIllustration brand={candidate.brand} name={candidate.name} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{candidate.brand}</p>
          <p className="font-serif font-bold text-sm truncate leading-tight">{candidate.name}</p>
        </div>
        <VerdictBadge verdict={a.verdict} />
      </div>

      <div className="space-y-2.5">
        <DeltaBar label={t.performance} description={t.upgradeSpeedDesc}   delta={a.performanceDelta} delay={index * 0.1 + 0.3} />
        <DeltaBar label={t.camera}      description={t.upgradeCamDesc}    delta={a.cameraDelta}      delay={index * 0.1 + 0.38} />
        <DeltaBar label={t.battery}     description={t.upgradeBattDesc}   delta={a.batteryDelta}     delay={index * 0.1 + 0.46} />
        <DeltaBar label={t.display}     description={t.upgradeDisplayDesc} delta={a.displayDelta}    delay={index * 0.1 + 0.54} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 group/tip relative">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            {t.overall}
          </span>
          <Info className="w-3 h-3 text-muted-foreground/40 group-hover/tip:text-muted-foreground/70 transition-colors cursor-default" />
          <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-52 z-10
            opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200">
            <div className="bg-popover border border-border rounded-lg px-3 py-2.5 shadow-xl">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t.upgradeOverallTip}
              </p>
            </div>
          </div>
        </div>
        <span className={`text-xl font-bold font-serif ${overallColor}`}>
          {a.overallDelta > 0 ? "+" : ""}{a.overallDelta}%
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed border-s-2 border-border/70 ps-3">
        {a.explanation}
      </p>
    </motion.div>
  );
}

export default function UpgradeSection({ currentPhone, candidates }: Props) {
  const { t } = useLanguage();
  if (candidates.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">
          {t.isItWorthUpgrading}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-3 mb-5 px-4 py-2.5 bg-card/60 border border-border/60 rounded-xl"
      >
        <div className="w-7 shrink-0">
          <PhoneIllustration brand={currentPhone.brand} name={currentPhone.name} />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
            {t.comparingFrom}
          </p>
          <p className="font-semibold text-sm leading-none">
            {currentPhone.brand} {currentPhone.name}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {candidates.map((c, i) => (
          <UpgradeCard key={c.id} currentPhone={currentPhone} candidate={c} index={i} />
        ))}
      </div>
    </section>
  );
}
