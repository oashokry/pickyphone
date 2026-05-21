import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, XCircle, RotateCcw } from "lucide-react";
import { phones } from "@/data/phones";
import { scorePhone, Priority, UsageType } from "@/lib/scoring";
import PhoneIllustration from "@/components/PhoneIllustration";
import { WatchReviewButton } from "@/components/ReviewButtons";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { analyzeDescription, analyzeKeywords, analyzeTitle, getCanonicalUrl, phonePath } from "@/lib/seo";
import { useLanguage, LanguageToggle } from "@/context/LanguageContext";

type Verdict = "Worth It" | "Depends" | "Not Worth It";

function verdictDetails(pct: number, t: ReturnType<typeof useLanguage>["t"]): { verdict: Verdict; color: string; icon: typeof CheckCircle2; explanation: string } {
  if (pct >= 78) return { verdict: "Worth It", color: "text-emerald-400", icon: CheckCircle2, explanation: `At ${pct}% match, this phone strongly aligns with your priorities. It delivers where it counts for you.` };
  if (pct >= 58) return { verdict: "Depends", color: "text-amber-400", icon: AlertCircle, explanation: `A ${pct}% match — solid in some areas but not your perfect fit. Consider if the trade-offs are acceptable.` };
  return { verdict: "Not Worth It", color: "text-red-400", icon: XCircle, explanation: `Only ${pct}% match for your needs. There are better options at this price point for what you value.` };
}

function peerContext(phone: typeof phones[0], pct: number, usage: UsageType, priority: Priority): string {
  const prefs = { budget: [phone.price * 0.8, phone.price * 1.2] as [number, number], usageType: usage, priority };
  const peers = phones.filter(p => p.id !== phone.id && Math.abs(p.price - phone.price) <= phone.price * 0.25).map(p => ({ phone: p, score: scorePhone(p, prefs) })).sort((a, b) => b.score - a.score);
  if (peers.length === 0) return "";
  const better = peers.filter(p => p.score > pct).length;
  if (better === 0) return `It outperforms all ${peers.length} similarly-priced alternatives for your use case.`;
  if (better <= 2) return `Only ${better} phone${better > 1 ? "s" : ""} in this price range score${better === 1 ? "s" : ""} higher for your needs.`;
  return `${better} similarly-priced phones score higher for your needs — worth comparing before deciding.`;
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function Analyze() {
  const params = useParams<{ id: string }>();
  const phone = phones.find(p => p.id === params.id);
  const [step, setStep] = useState(0);
  const [budgetIdx, setBudgetIdx] = useState<number | null>(null);
  const [usage, setUsage] = useState<UsageType | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const USAGE_TYPES: { value: UsageType; label: string; desc: string }[] = [
    { value: "Photography", label: t.photography, desc: t.usagePhotoDesc },
    { value: "Gaming",      label: t.gaming,       desc: t.usageGamingDesc },
    { value: "Work",        label: t.work,         desc: t.usageWorkDesc },
    { value: "Casual",      label: t.casual,       desc: t.usageCasualDesc },
    { value: "Mixed",       label: t.mixedUseLabel, desc: t.usageMixedDesc },
  ];

  const PRIORITIES: { value: Priority; label: string }[] = [
    { value: "camera",      label: t.camera },
    { value: "performance", label: t.performance },
    { value: "battery",     label: t.battery },
    { value: "display",     label: t.display },
    { value: "price",       label: t.priorityPriceValue },
    { value: "balanced",    label: t.balanced },
  ];

  const BUDGET_PRESETS: { label: string; range: [number, number] }[] = [
    { label: t.budgetUnder500, range: [0, 499] },
    { label: t.budgetMid,      range: [500, 800] },
    { label: t.budgetPremium,  range: [800, 1100] },
    { label: t.budgetFlagship, range: [1100, 2500] },
  ];

  const canNext = [budgetIdx !== null, usage !== null, priority !== null];
  const matchPct = useMemo(() => {
    if (!submitted || !phone || budgetIdx === null || !usage || !priority) return null;
    const prefs = { budget: BUDGET_PRESETS[budgetIdx].range, usageType: usage, priority };
    return scorePhone(phone, prefs);
  }, [submitted, phone, budgetIdx, usage, priority]);

  const verdict = matchPct !== null ? verdictDetails(matchPct, t) : null;
  const peer = matchPct !== null && phone && usage && priority ? peerContext(phone, matchPct, usage, priority) : "";
  const url = phone ? getCanonicalUrl(`/analyze/${phone.id}`) : getCanonicalUrl("/analyze");
  const reset = () => { setStep(0); setBudgetIdx(null); setUsage(null); setPriority(null); setSubmitted(false); };

  const verdictLabel: Record<Verdict, string> = {
    "Worth It": t.worthItVerdict,
    "Depends": t.dependsVerdict,
    "Not Worth It": t.notWorthItVerdict,
  };

  if (!phone) return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground items-center justify-center">
      <p className="text-muted-foreground mb-4">{t.phoneNotFound}</p>
      <Link href="/browse" className="text-primary underline text-sm">{t.backToBrowse}</Link>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Seo title={analyzeTitle(phone)} description={analyzeDescription(phone)} keywords={analyzeKeywords(phone)} url={url} canonical={url} image={phone.imageUrl} />
      <header className="border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link href={`/phones/${phone.id}`}>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="hidden sm:inline">{t.back}</span>
          </button>
        </Link>
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary mx-auto">PickyPhone.</Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Phones", href: "/browse" }, { name: phone.name, href: phonePath(phone.id) }, { name: "Analyze", href: `/analyze/${phone.id}` }]} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card mb-8">
          <div className="w-14 h-20 shrink-0"><PhoneIllustration brand={phone.brand} name={phone.name} /></div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{phone.brand}</p>
            <h2 className="font-serif font-bold text-lg">{phone.name}</h2>
            <p className="text-primary font-semibold">${phone.price.toLocaleString()}</p>
          </div>
          <div className="ms-auto text-end">
            <p className="text-xs text-muted-foreground font-medium">Is It</p>
            <p className="font-serif font-bold text-primary text-lg">{t.isItWorthIt}</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="questionnaire" initial="hidden" animate="show" exit={{ opacity: 0 }} variants={fadeUp}>
              {/* Progress dots */}
              <div className="flex gap-1.5 mb-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>

              {/* Step 0 — Budget */}
              {step === 0 && (
                <motion.div key="step0" initial="hidden" animate="show" variants={fadeUp} className="space-y-4">
                  <h3 className="text-lg font-serif font-bold">{t.budgetLabel}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUDGET_PRESETS.map((b, i) => (
                      <button key={i} onClick={() => setBudgetIdx(i)} className={`p-4 rounded-xl border text-start text-sm font-medium transition-all duration-300 ${budgetIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1 — Usage */}
              {step === 1 && (
                <motion.div key="step1" initial="hidden" animate="show" variants={fadeUp} className="space-y-4">
                  <h3 className="text-lg font-serif font-bold">{t.usageLabel}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {USAGE_TYPES.map(u => (
                      <button key={u.value} onClick={() => setUsage(u.value)} className={`p-4 rounded-xl border text-start transition-all duration-300 ${usage === u.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                        <p className="font-semibold text-sm">{u.label}</p>
                        <p className="text-xs opacity-70 mt-0.5">{u.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Priority */}
              {step === 2 && (
                <motion.div key="step2" initial="hidden" animate="show" variants={fadeUp} className="space-y-4">
                  <h3 className="text-lg font-serif font-bold">{t.priorityLabel}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRIORITIES.map(p => (
                      <button key={p.value} onClick={() => setPriority(p.value)} className={`p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${priority === p.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 0 ? (
                  <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t.back}
                  </button>
                ) : <div />}
                {step < 2 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canNext[step]}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    Next <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={!canNext[2]}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    {t.seeMyResults} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial="hidden" animate="show" variants={fadeUp} className="space-y-6">
              {verdict && (
                <>
                  <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
                    <verdict.icon className={`w-12 h-12 mx-auto ${verdict.color}`} />
                    <p className={`text-3xl font-serif font-bold ${verdict.color}`}>{verdictLabel[verdict.verdict]}</p>
                    {matchPct !== null && <p className="text-5xl font-bold text-foreground">{matchPct}%</p>}
                    <p className="text-sm text-muted-foreground leading-relaxed">{verdict.explanation}</p>
                    {peer && <p className="text-xs text-muted-foreground border-t border-border/50 pt-3 mt-3">{peer}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-muted-foreground text-sm font-medium hover:border-primary/40 hover:text-primary transition-all">
                      <RotateCcw className="w-4 h-4" /> Retry
                    </button>
                    <WatchReviewButton phone={phone} />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
