import { useMemo } from "react";
import { useSearch } from "wouter";
import { useComparison } from "@/context/ComparisonContext";
import { phones as dbPhones, Phone } from "@/data/phones";
import {
  Priority, UsageType, UserPreferences,
  computeMatchScores, computeWinners, findBestMatch, getBestPhone, generateMatchReason,
} from "@/lib/scoring";

/**
 * useComparisonResults — custom hook that consolidates all URL param parsing,
 * context merging, and memoised score/winner derivation for the results page.
 */
export function useComparisonResults() {
  const {
    selectedPhoneIds,
    priority: ctxPriority,
    budget: ctxBudget,
    usageType: ctxUsage,
    currentPhoneId: ctxCurrentId,
  } = useComparison();

  const search = useSearch();

  // ── URL param parsing ────────────────────────────────────────────────────────
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const urlPhoneIds  = useMemo(() => params.get("phones")?.split(",").filter(Boolean) ?? [], [params]);
  const urlPriority  = params.get("priority") as Priority | null;
  const urlBudgetRaw = params.get("budget");
  const urlUsage     = params.get("usage") as UsageType | null;
  const urlCurrentId = params.get("current");

  // ── Value resolution: prefer context (live session) over URL params (shared link) ──
  const activePhoneIds = selectedPhoneIds.some(id => id !== null) ? selectedPhoneIds : urlPhoneIds;
  const activePriority: Priority = ctxPriority ?? urlPriority ?? "balanced";

  const urlBudget = useMemo((): [number, number] | null => {
    if (!urlBudgetRaw) return null;
    const parts = urlBudgetRaw.split("-").map(Number);
    return parts.length === 2 && !parts.some(isNaN) ? [parts[0], parts[1]] : null;
  }, [urlBudgetRaw]);

  const activeBudget: [number, number] = urlBudget ?? ctxBudget ?? [0, 2000];
  const activeUsage: UsageType        = urlUsage    ?? ctxUsage    ?? "Mixed";
  const activeCurrentId: string | null = urlCurrentId ?? ctxCurrentId ?? null;

  const hasPrefs = !!(urlBudgetRaw && urlUsage);

  // ── Derived phone objects ────────────────────────────────────────────────────
  const selectedPhones = useMemo((): Phone[] =>
    activePhoneIds
      .filter((id): id is string => id !== null)
      .map(id => dbPhones.find(p => p.id === id))
      .filter((p): p is Phone => p !== undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePhoneIds.join(",")]
  );

  const currentPhone = useMemo(
    () => activeCurrentId ? (dbPhones.find(p => p.id === activeCurrentId) ?? null) : null,
    [activeCurrentId]
  );

  // ── Scoring ──────────────────────────────────────────────────────────────────
  const prefs: UserPreferences = useMemo(
    () => ({ budget: activeBudget, usageType: activeUsage, priority: activePriority }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeBudget[0], activeBudget[1], activeUsage, activePriority]
  );

  const matchScores = useMemo(
    () => hasPrefs ? computeMatchScores(selectedPhones, prefs) : {},
    [hasPrefs, selectedPhones, prefs]
  );

  const bestMatch = useMemo(
    () => hasPrefs && selectedPhones.length > 0 ? findBestMatch(selectedPhones, matchScores) : null,
    [hasPrefs, selectedPhones, matchScores]
  );

  const winners = useMemo(() => computeWinners(selectedPhones), [selectedPhones]);

  const recommendation = useMemo(
    () => selectedPhones.length > 0 ? getBestPhone(selectedPhones, activePriority) : null,
    [selectedPhones, activePriority]
  );

  const bestMatchReason = useMemo(
    () => bestMatch ? generateMatchReason(bestMatch, prefs, matchScores[bestMatch.id]) : "",
    [bestMatch, prefs, matchScores]
  );

  // ── Share URL builder ────────────────────────────────────────────────────────
  function buildShareUrl(base: string): string {
    const ids = selectedPhones.map(p => p.id).join(",");
    const budgetStr = `${activeBudget[0]}-${activeBudget[1]}`;
    const currentParam = activeCurrentId ? `&current=${activeCurrentId}` : "";
    return hasPrefs
      ? `${base}?phones=${ids}&priority=${activePriority}&budget=${budgetStr}&usage=${activeUsage}${currentParam}`
      : `${base}?phones=${ids}&priority=${activePriority}${currentParam}`;
  }

  return {
    selectedPhones,
    currentPhone,
    activePriority,
    activeBudget,
    activeUsage,
    activeCurrentId,
    hasPrefs,
    prefs,
    matchScores,
    bestMatch,
    bestMatchReason,
    winners,
    recommendation,
    buildShareUrl,
  };
}
