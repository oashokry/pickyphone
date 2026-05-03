import { useEffect, useState } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { useComparison } from "@/context/ComparisonContext";
import { phones as dbPhones, Phone } from "@/data/phones";
import {
  getBestPhone, scorePhone, generateMatchReason,
  Priority, UsageType, UserPreferences,
} from "@/lib/recommendation";
import PhoneCard from "@/components/PhoneCard";
import RecommendationBanner from "@/components/RecommendationBanner";
import BestForYouCard from "@/components/BestForYouCard";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Results() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { selectedPhoneIds, priority: ctxPriority, budget: ctxBudget, usageType: ctxUsage } = useComparison();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Parse URL params (shared links or preferences page hand-off)
  const params = new URLSearchParams(search);
  const urlPhoneIds = params.get("phones")?.split(",").filter(Boolean) ?? [];
  const urlPriority = params.get("priority") as Priority | null;
  const urlBudgetRaw = params.get("budget");
  const urlUsage = params.get("usage") as UsageType | null;

  // Resolve active values: context if set, else URL params, else defaults
  const activePhoneIds = selectedPhoneIds.some(id => id !== null) ? selectedPhoneIds : urlPhoneIds;
  const activePriority: Priority = ctxPriority ?? urlPriority ?? "balanced";

  // Parse budget from URL param "500-1200"
  const urlBudget: [number, number] | null = urlBudgetRaw
    ? (() => {
        const parts = urlBudgetRaw.split("-").map(Number);
        return parts.length === 2 && !parts.some(isNaN) ? [parts[0], parts[1]] : null;
      })()
    : null;
  const activeBudget: [number, number] = ctxBudget ?? urlBudget ?? [0, 2000];
  const activeUsage: UsageType = ctxUsage ?? urlUsage ?? "Mixed";

  // Determine if we have personalized preferences
  const hasPrefs = !!(urlBudgetRaw && urlUsage);

  const selectedPhones = activePhoneIds
    .filter(id => id !== null)
    .map(id => dbPhones.find(p => p.id === id))
    .filter(Boolean) as Phone[];

  useEffect(() => {
    if (selectedPhones.length === 0) {
      setLocation("/compare");
      return;
    }
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [selectedPhones.length, setLocation]);

  if (selectedPhones.length === 0) return null;

  // Compute match scores if preferences were provided
  const prefs: UserPreferences = { budget: activeBudget, usageType: activeUsage, priority: activePriority };
  const matchScores: Record<string, number> = {};
  if (hasPrefs) {
    selectedPhones.forEach(p => { matchScores[p.id] = scorePhone(p, prefs); });
  }

  // Best match phone (highest score)
  const bestMatch = hasPrefs
    ? selectedPhones.reduce((best, p) => matchScores[p.id] > matchScores[best.id] ? p : best, selectedPhones[0])
    : null;

  const recommendation = !loading ? getBestPhone(selectedPhones, activePriority) : null;

  const winners = {
    price: selectedPhones.reduce((min, p) => p.price < min.price ? p : min, selectedPhones[0]).id,
    displayScore: selectedPhones.reduce((max, p) => p.displayScore > max.displayScore ? p : max, selectedPhones[0]).id,
    cameraScore: selectedPhones.reduce((max, p) => p.camera.score > max.camera.score ? p : max, selectedPhones[0]).id,
    performanceScore: selectedPhones.reduce((max, p) => p.performance.score > max.performance.score ? p : max, selectedPhones[0]).id,
    batteryScore: selectedPhones.reduce((max, p) => p.battery.score > max.battery.score ? p : max, selectedPhones[0]).id,
  };

  const handleShare = async () => {
    const ids = selectedPhones.map(p => p.id).join(",");
    const budgetStr = `${activeBudget[0]}-${activeBudget[1]}`;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = hasPrefs
      ? `${baseUrl}?phones=${ids}&priority=${activePriority}&budget=${budgetStr}&usage=${activeUsage}`
      : `${baseUrl}?phones=${ids}&priority=${activePriority}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/compare" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className={`flex items-center gap-2 text-sm border transition-all duration-300 ${
              copied
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {copied ? <><Check className="w-4 h-4" />Link Copied!</> : <><Share2 className="w-4 h-4" />Share</>}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <Skeleton className="h-48 w-full rounded-2xl bg-card" />
            <div className={`grid grid-cols-1 md:grid-cols-${selectedPhones.length} gap-6`}>
              {selectedPhones.map(p => (
                <Skeleton key={p.id} className="h-[800px] rounded-2xl bg-card" />
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

            {/* Best For You card (personalized) */}
            {hasPrefs && bestMatch && (
              <BestForYouCard
                phone={bestMatch}
                matchPct={matchScores[bestMatch.id]}
                reason={generateMatchReason(bestMatch, prefs, matchScores[bestMatch.id])}
                usageType={activeUsage}
                budget={activeBudget}
              />
            )}

            {/* Legacy best-choice banner (no preferences) */}
            {!hasPrefs && recommendation && (
              <RecommendationBanner phone={recommendation.phone} reason={recommendation.reason} />
            )}

            <div className="mt-16 mb-6">
              <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">Detailed Comparison</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedPhones.map((phone, i) => (
                <motion.div
                  key={phone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6 }}
                >
                  <PhoneCard
                    phone={phone}
                    winners={winners}
                    matchPct={hasPrefs ? matchScores[phone.id] : undefined}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
