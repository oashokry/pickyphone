import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { useComparisonResults } from "@/hooks/useComparisonResults";
import PhoneCard from "@/components/PhoneCard";
import RecommendationBanner from "@/components/RecommendationBanner";
import BestForYouCard from "@/components/BestForYouCard";
import UpgradeSection from "@/components/UpgradeSection";
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
            <div className="mt-14 mb-5">
              <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">
                Detailed Comparison
              </h2>
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
