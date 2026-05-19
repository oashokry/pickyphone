import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Check, Languages, X, Loader2 } from "lucide-react";
import { useComparisonResults } from "@/hooks/useComparisonResults";
import PhoneCard from "@/components/PhoneCard";
import RecommendationBanner from "@/components/RecommendationBanner";
import BestForYouCard from "@/components/BestForYouCard";
import UpgradeSection from "@/components/UpgradeSection";
import { WatchComparisonButton } from "@/components/ReviewButtons";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Results() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const {
    selectedPhones,
    currentPhone,
    activePriority,
    activeBudget,
    activeUsage,
    hasPrefs,
    prefs,
    matchScores,
    bestMatch,
    bestMatchReason,
    winners,
    recommendation,
    buildShareUrl,
  } = useComparisonResults();

  useEffect(() => {
    if (selectedPhones.length === 0) { setLocation("/compare"); return; }
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [selectedPhones.length, setLocation]);

  if (selectedPhones.length === 0) return null;

  const handleShare = async () => {
    const url = buildShareUrl(`${window.location.origin}${window.location.pathname}`);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = Object.assign(document.createElement("input"), { value: url });
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">

      {/* ── Header ── */}
      <header className="border-b border-border/40 px-4 py-3 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/compare" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Link>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className={`flex items-center gap-1.5 text-sm border transition-all duration-300 ${
              copied
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" />Copied!</>
              : <><Share2 className="w-3.5 h-3.5" />Share</>}
          </Button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:px-8">
        {loading ? (
          <LoadingSkeleton count={selectedPhones.length} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Best For You (personalised) */}
            {hasPrefs && bestMatch && (
              <BestForYouCard
                phone={bestMatch}
                matchPct={matchScores[bestMatch.id]}
                reason={bestMatchReason}
                usageType={activeUsage}
                budget={activeBudget}
              />
            )}

            {/* Quick recommendation (no preferences) */}
            {!hasPrefs && recommendation && (
              <RecommendationBanner phone={recommendation.phone} reason={recommendation.reason} />
            )}

            {/* Upgrade analysis */}
            {currentPhone && (
              <UpgradeSection
                currentPhone={currentPhone}
                candidates={selectedPhones.filter(p => p.id !== currentPhone.id)}
              />
            )}

            {/* Detailed comparison */}
            <div className="mt-14 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">
                Detailed Comparison
              </h2>
              <div className="pb-1 flex items-center gap-3">
                <CompareTranslateButton phones={selectedPhones} />
                <WatchComparisonButton phones={selectedPhones} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {selectedPhones.map((phone, i) => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  winners={winners}
                  matchPct={hasPrefs ? matchScores[phone.id] : undefined}
                  animationDelay={i * 0.1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CompareTranslateButton({ phones }: { phones: { id: string; brand: string; name: string; price: number; display: unknown; camera: unknown; performance: unknown; battery: unknown; storage: unknown }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    if (comparison) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phones }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { comparison: string };
      setComparison(data.comparison);
    } catch {
      setError("Couldn't generate comparison right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const phoneNames = phones.map(p => p.name).join(" vs ");

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) {
        return <h3 key={i} className="text-sm font-serif font-bold text-primary mt-5 mb-2 first:mt-0">{line.replace("## ", "")}</h3>;
      }
      if (line.trim() === "") return null;
      return <p key={i} className="text-sm text-foreground/85 leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/12 hover:border-primary/60 transition-all duration-300"
      >
        <Languages className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Plain English Summary
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-7 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-border/60 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Languages className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Plain English</p>
                  <h3 className="text-base font-serif font-bold leading-tight">{phoneNames}</h3>
                </div>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-sm">Translating specs into plain English…</p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 text-center py-8">{error}</p>
              )}

              {comparison && (
                <div>{renderMarkdown(comparison)}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-6 pt-4">
      <Skeleton className="h-44 w-full rounded-2xl bg-card" />
      <div className={`grid gap-5 ${count === 2 ? "grid-cols-1 sm:grid-cols-2" : count === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-[780px] rounded-2xl bg-card" />
        ))}
      </div>
    </div>
  );
}
