import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, AlertCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { Phone } from "@/data/phones";
import { useLanguage } from "@/context/LanguageContext";
import type { Translations } from "@/context/LanguageContext";

interface Props {
  phone: Phone;
}

type AnswerKey = "budget" | "use" | "camera" | "battery" | "performance";

interface Answers {
  budget: string;
  use: string;
  camera: string;
  battery: string;
  performance: string;
}

function buildQuestions(t: Translations) {
  return [
    {
      key: "budget" as AnswerKey,
      step: 1,
      question: t.q1,
      subtitle: t.q1Sub,
      options: [
        { label: t.q1a, value: "500" },
        { label: t.q1b, value: "800" },
        { label: t.q1c, value: "1200" },
        { label: t.q1d, value: "2000" },
      ],
    },
    {
      key: "use" as AnswerKey,
      step: 2,
      question: t.q2,
      subtitle: t.q2Sub,
      options: [
        { label: t.q2a, value: "gaming" },
        { label: t.q2b, value: "photo" },
        { label: t.q2c, value: "work" },
        { label: t.q2d, value: "casual" },
        { label: t.q2e, value: "media" },
      ],
    },
    {
      key: "camera" as AnswerKey,
      step: 3,
      question: t.q3,
      subtitle: t.q3Sub,
      options: [
        { label: t.q3a, value: "high" },
        { label: t.q3b, value: "mid" },
        { label: t.q3c, value: "low" },
      ],
    },
    {
      key: "battery" as AnswerKey,
      step: 4,
      question: t.q4,
      subtitle: t.q4Sub,
      options: [
        { label: t.q4a, value: "high" },
        { label: t.q4b, value: "mid" },
        { label: t.q4c, value: "low" },
      ],
    },
    {
      key: "performance" as AnswerKey,
      step: 5,
      question: t.q5,
      subtitle: t.q5Sub,
      options: [
        { label: t.q5a, value: "high" },
        { label: t.q5b, value: "mid" },
        { label: t.q5c, value: "low" },
      ],
    },
  ];
}

function scoreAnswers(phone: Phone, answers: Answers, t: Translations): { total: number; breakdown: { label: string; points: number; max: number; note: string }[] } {
  const breakdown: { label: string; points: number; max: number; note: string }[] = [];
  const price = `$${phone.price.toLocaleString()}`;

  // Budget (0–2)
  const budget = parseInt(answers.budget);
  let budgetPts = 0;
  let budgetNote = "";
  if (phone.price <= budget) {
    budgetPts = 2; budgetNote = t.budgetNoteGood(price);
  } else if (phone.price <= budget * 1.2) {
    budgetPts = 1; budgetNote = t.budgetNoteStretch(price);
  } else {
    budgetPts = 0; budgetNote = t.budgetNoteOver(price);
  }
  breakdown.push({ label: t.breakdownBudget, points: budgetPts, max: 2, note: budgetNote });

  // Primary use (0–2)
  const use = answers.use;
  let usePts = 0;
  let useNote = "";
  if (use === "gaming") {
    if (phone.performance.score >= 92 && phone.displayScore >= 88) { usePts = 2; useNote = t.useGaming2; }
    else if (phone.performance.score >= 80) { usePts = 1; useNote = t.useGaming1; }
    else { usePts = 0; useNote = t.useGaming0; }
  } else if (use === "photo") {
    if (phone.camera.score >= 92) { usePts = 2; useNote = t.usePhoto2; }
    else if (phone.camera.score >= 80) { usePts = 1; useNote = t.usePhoto1; }
    else { usePts = 0; useNote = t.usePhoto0; }
  } else if (use === "work") {
    if (phone.performance.score >= 88 && phone.battery.score >= 82) { usePts = 2; useNote = t.useWork2; }
    else if (phone.performance.score >= 80) { usePts = 1; useNote = t.useWork1; }
    else { usePts = 0; useNote = t.useWork0; }
  } else if (use === "casual") {
    if (phone.price <= 700 || phone.battery.score >= 85) { usePts = 2; useNote = t.useCasual2; }
    else { usePts = 1; useNote = t.useCasual1; }
  } else if (use === "media") {
    if (phone.displayScore >= 90 && phone.battery.score >= 85) { usePts = 2; useNote = t.useMedia2; }
    else if (phone.displayScore >= 80) { usePts = 1; useNote = t.useMedia1; }
    else { usePts = 0; useNote = t.useMedia0; }
  }
  breakdown.push({ label: t.breakdownUse, points: usePts, max: 2, note: useNote });

  // Camera (0–2)
  const camImportance = answers.camera;
  let camPts = 0;
  let camNote = "";
  if (camImportance === "high") {
    if (phone.camera.score >= 92) { camPts = 2; camNote = t.cam2High(phone.camera.score); }
    else if (phone.camera.score >= 80) { camPts = 1; camNote = t.cam1High(phone.camera.score); }
    else { camPts = 0; camNote = t.cam0High(phone.camera.score); }
  } else if (camImportance === "mid") {
    if (phone.camera.score >= 78) { camPts = 2; camNote = t.cam2Mid; }
    else { camPts = 1; camNote = t.cam1Mid; }
  } else {
    camPts = 2; camNote = t.cam2Low;
  }
  breakdown.push({ label: t.breakdownCamera, points: camPts, max: 2, note: camNote });

  // Battery (0–2)
  const battImportance = answers.battery;
  let battPts = 0;
  let battNote = "";
  if (battImportance === "high") {
    if (phone.battery.score >= 88) { battPts = 2; battNote = t.batt2High(phone.battery.score); }
    else if (phone.battery.score >= 78) { battPts = 1; battNote = t.batt1High(phone.battery.score); }
    else { battPts = 0; battNote = t.batt0High(phone.battery.score); }
  } else if (battImportance === "mid") {
    if (phone.battery.score >= 80) { battPts = 2; battNote = t.batt2Mid; }
    else { battPts = 1; battNote = t.batt1Mid; }
  } else {
    battPts = 2; battNote = t.batt2Low;
  }
  breakdown.push({ label: t.breakdownBattery, points: battPts, max: 2, note: battNote });

  // Performance (0–2)
  const perfNeeds = answers.performance;
  let perfPts = 0;
  let perfNote = "";
  if (perfNeeds === "high") {
    if (phone.performance.score >= 92) { perfPts = 2; perfNote = t.perf2High(phone.performance.score); }
    else if (phone.performance.score >= 82) { perfPts = 1; perfNote = t.perf1High(phone.performance.score); }
    else { perfPts = 0; perfNote = t.perf0High(phone.performance.score); }
  } else if (perfNeeds === "mid") {
    if (phone.performance.score >= 78) { perfPts = 2; perfNote = t.perf2Mid; }
    else { perfPts = 1; perfNote = t.perf1Mid; }
  } else {
    perfPts = 2; perfNote = t.perf2Low;
  }
  breakdown.push({ label: t.breakdownPerf, points: perfPts, max: 2, note: perfNote });

  return { total: breakdown.reduce((s, b) => s + b.points, 0), breakdown };
}

type Verdict = "worth-it" | "depends" | "not-worth-it";
function getVerdict(total: number): Verdict {
  if (total >= 8) return "worth-it";
  if (total >= 5) return "depends";
  return "not-worth-it";
}

export default function IsItWorthIt({ phone }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<ReturnType<typeof scoreAnswers> | null>(null);

  const questions = buildQuestions(t);

  const verdictConfig = {
    "worth-it":     { label: t.worthItVerdict,    icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10", bar: "bg-emerald-400", summary: t.worthItSummary },
    "depends":      { label: t.dependsVerdict,     icon: AlertCircle,  color: "text-amber-400",   border: "border-amber-400/30",   bg: "bg-amber-400/10",   bar: "bg-amber-400",   summary: t.dependsSummary },
    "not-worth-it": { label: t.notWorthItVerdict,  icon: XCircle,      color: "text-red-400",     border: "border-red-400/30",     bg: "bg-red-400/10",     bar: "bg-red-400",     summary: t.notWorthItSummary },
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); };
  const close = () => { setOpen(false); setTimeout(reset, 350); };

  const handleAnswer = (key: AnswerKey, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 120);
    } else {
      const final = next as Answers;
      setTimeout(() => setResult(scoreAnswers(phone, final, t)), 120);
    }
  };

  const current = questions[step];
  const verdict = result ? getVerdict(result.total) : null;
  const cfg = verdict ? verdictConfig[verdict] : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-amber-400/30 bg-amber-400/8 text-amber-400 font-semibold text-sm hover:bg-amber-400/15 hover:border-amber-400/60 transition-all duration-300"
      >
        <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {t.isItWorthItBtn}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-border/60 text-muted-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-7 pt-6"
                  >
                    <div className="flex gap-1.5 mb-6">
                      {questions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full flex-1 transition-all duration-400 ${i <= step ? "bg-amber-400" : "bg-border"}`}
                        />
                      ))}
                    </div>

                    <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-1">
                      {t.questionOf(current.step, questions.length)}
                    </p>
                    <h3 className="text-xl font-serif font-bold leading-snug mb-1.5">
                      {current.question}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6">{current.subtitle}</p>

                    <div className="space-y-2.5">
                      {current.options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(current.key, opt.value)}
                          className="group w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-background/50 text-sm font-medium text-start hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-400 transition-all duration-200"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 rtl:rotate-180" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="p-7 pt-6 max-h-[85vh] overflow-y-auto"
                  >
                    {(() => { const VerdictIcon = cfg!.icon; return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${cfg!.border} ${cfg!.bg} mb-4`}>
                      <VerdictIcon className={`w-4 h-4 ${cfg!.color}`} />
                      <span className={`text-sm font-bold ${cfg!.color}`}>{cfg!.label}</span>
                    </div>
                    ); })()}

                    <h3 className="text-xl font-serif font-bold mb-1">
                      {phone.brand} {phone.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {cfg!.summary}
                    </p>

                    <div className="mb-5 p-4 rounded-2xl bg-background/60 border border-border/60">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{t.overallMatch}</span>
                        <span className={`text-sm font-bold ${cfg!.color}`}>{result.total}/10</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(result.total / 10) * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                          className={`h-full rounded-full ${cfg!.bar}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {result.breakdown.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                          className="p-3.5 rounded-xl bg-background/40 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold">{item.label}</span>
                            <span className={`text-xs font-bold ${item.points >= item.max ? "text-emerald-400" : item.points > 0 ? "text-amber-400" : "text-red-400"}`}>
                              {item.points}/{item.max}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{item.note}</p>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={reset}
                      className="group w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-muted-foreground text-sm font-medium hover:border-amber-400/40 hover:text-amber-400 transition-all duration-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform duration-300" />
                      {t.retakeQuiz}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
