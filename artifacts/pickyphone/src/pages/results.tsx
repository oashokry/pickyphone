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
import UpgradeSection from "@/components/UpgradeSection";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Results() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { selectedPhoneIds, priority: ctxPriority, budget: ctxBudget, usageType: ctxUsage, currentPhoneId: ctxCurrentId } = useComparison();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Parse URL params (shared links or preferences hand-off)
  const params = new URLSearchParams(search);
  const urlPhoneIds   = params.get("phones")?.split(",").filter(Boolean) ?? [];
  const urlPriority   = params.get("priority") as Priority | null;
  const urlBudgetRaw  = params.get("budget");
  const urlUsage      = params.get("usage") as UsageType | null;
  const urlCurrentId  = params.get("current");

  // Resolve active values — prefer context, fall back to URL params
  const activePhoneIds  = selectedPhoneIds.some(id => id !== null) ? selectedPhoneIds : urlPhoneIds;
  const activePriority: Priority = ctxPriority ?? urlPriority ?? "balanced";

  const urlBudget: [number, number] | null = urlBudgetRaw
    ? (() => {
        const parts = urlBudgetRaw.split("-").map(Number);
        return parts.length === 2 && !parts.some(isNaN) ? [parts[0], parts[1]] : null;
      })()
    : null;
  const activeBudget: [number, number] = urlBudget ?? ctxBudget ?? [0, 2000];
  const activeUsage: UsageType  = urlUsage  ?? ctxUsage  ?? "Mixed";
  const activeCurrentId: string | null = urlCurrentId ?? ctxCurrentId ?? null;

  const hasPrefs      = !!(urlBudgetRaw && urlUsage);
  const currentPhone  = activeCurrentId ? dbPhones.find(p => p.id === activeCurrentId) ?? null : null;

  const selectedPhones = activePhoneIds
    .filter(id => id !== null)
    .map(id => dbPhones.find(p => p.id === id))
    .filter(Boolean) as Phone[];

  useEffect(() => {
    if (selectedPhones.length === 0) { setLocation("/compare"); return; }
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [selectedPhones.length, setLocation]);

  if (selectedPhones.length === 0) return null;

  // Personalised scores
  const prefs: UserPreferences = { budget: activeBudget, usageType: activeUsage, priority: activePriority };
  const matchScores: Record<string, number> = {};
  if (hasPrefs) selectedPhones.forEach(p => { matchScores[p.id] = scorePhone(p, prefs); });

  const bestMatch = hasPrefs
    ? selectedPhones.reduce((best, p) => matchScores[p.id] > matchScores[best.id] ? p : best, selectedPhones[0])
    : null;

  const recommendation = !loading ? getBestPhone(selectedPhones, activePriority) : null;

  const winners = {
    price:            selectedPhones.reduce((m, p) => p.price < m.price ? p : m, selectedPhones[0]).id,
    displayScore:     selectedPhones.reduce((m, p) => p.displayScore > m.displayScore ? p : m, selectedPhones[0]).id,
    cameraScore:      selectedPhones.reduce((m, p) => p.camera.score > m.camera.score ? p : m, selectedPhones[0]).id,
    performanceScore: selectedPhones.reduce((m, p) => p.performance.score > m.performance.score ? p : m, selectedPhones[0]).id,
    batteryScore:     selectedPhones.reduce((m, p) => p.battery.score > m.battery.score ? p : m, selectedPhones[0]).id,
  };

  const handleShare = async () => {
    const ids        = selectedPhones.map(p => p.id).join(",");
    const budgetStr  = `${activeBudget[0]}-${activeBudget[1]}`;
    const base       = `${window.location.origin}${window.location.pathname}`;
    const currentParam = activeCurrentId ? `&current=${activeCurrentId}` : "";
    const shareUrl = hasPrefs
      ? `${base}?phones=${ids}&priority=${activePriority}&budget=${budgetStr}&usage=${activeUsage}${currentParam}`
      : `${base}?phones=${ids}&priority=${activePriority}${currentParam}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement("input");
      el.value = shareUrl;
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
      <header className="border-b border-border/40 p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/compare" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</span>
          <Button variant="outline" size="sm" onClick={handleShare}
            className={`flex items-center gap-2 text-sm border transition-all duration-300 ${copied ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"}`}>
            {copied ? <><Check className="w-4 h-4" />Link Copied!</> : <><Share2 className="w-4 h-4" />Share</>}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <Skeleton className="h-52 w-full rounded-2xl bg-card" />
            {currentPhone && <Skeleton className="h-64 w-full rounded-2xl bg-card" />}
            <div className={`grid grid-cols-1 md:grid-cols-${selectedPhones.length} gap-6`}>
              {selectedPhones.map(p => <Skeleton key={p.id} className="h-[800px] rounded-2xl bg-card" />)}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

            {/* Best For You */}
            {hasPrefs && bestMatch && (
              <BestForYouCard
                phone={bestMatch}
                matchPct={matchScores[bestMatch.id]}
                reason={generateMatchReason(bestMatch, prefs, matchScores[bestMatch.id])}
                usageType={activeUsage}
                budget={activeBudget}
              />
            )}

            {/* Legacy recommendation (no preferences) */}
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
            <div className="mt-16 mb-6">
              <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">Detailed Comparison</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedPhones.map((phone, i) => (
                <motion.div key={phone.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6 }}>
                  <PhoneCard phone={phone} winners={winners} matchPct={hasPrefs ? matchScores[phone.id] : undefined} />
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
