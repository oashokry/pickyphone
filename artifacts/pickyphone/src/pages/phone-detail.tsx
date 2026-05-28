import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, GitCompare, Sparkles, Languages, X, Loader2, Monitor, Cpu, Camera, BatteryCharging, Layers } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { phones, type Phone } from "@/data/phones";
import { useComparison } from "@/context/ComparisonContext";
import PhoneIllustration from "@/components/PhoneIllustration";
import { WatchReviewButton } from "@/components/ReviewButtons";
import WallpaperButton from "@/components/WallpaperButton";
import IsItWorthIt from "@/components/IsItWorthIt";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbSchema, buildPhoneSchema, getCanonicalUrl, phoneDescription, phoneKeywords, phonePath, phoneTitle } from "@/lib/seo";
import { useLanguage, LanguageToggle } from "@/context/LanguageContext";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] } }) };

// ── Helpers ────────────────────────────────────────────────────────────────────

function SpecTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-primary/20 bg-primary/8 text-primary">
      {label}
    </span>
  );
}

function SpecScoreBar({ score, delay }: { score: number; delay: number }) {
  const color = score >= 90 ? "from-emerald-500 to-emerald-400" : score >= 75 ? "from-amber-500 to-amber-400" : "from-red-500 to-red-400";
  const label = score >= 90 ? "text-emerald-400" : score >= 75 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className={`text-sm font-bold w-14 text-end ${label}`}>{score}/100</span>
    </div>
  );
}

function getDisplayTags(phone: Phone): string[] {
  const tags: string[] = [];
  const type = phone.display.type.toLowerCase();
  const rate = phone.display.refreshRate;
  const sz = parseFloat(phone.display.size);
  if (type.includes("oled") || type.includes("amoled")) tags.push("OLED");
  if (type.includes("ltpo")) tags.push("LTPO Adaptive");
  if (rate.includes("144") || rate.includes("165") || rate.includes("120")) tags.push(`${rate} Smooth`);
  if (sz >= 6.7) tags.push("Large Display");
  if (phone.displayScore >= 93) tags.push("Best-in-Class");
  return tags;
}

function getCameraTags(phone: Phone): string[] {
  const tags: string[] = [];
  const video = phone.camera.video.toLowerCase();
  const tele = phone.camera.telephoto.toLowerCase();
  const mpMatch = phone.camera.main.match(/(\d+)MP/i);
  if (mpMatch) tags.push(`${mpMatch[1]}MP Main`);
  if (video.includes("4k@120") || video.includes("4k 120")) tags.push("4K@120fps");
  else if (video.includes("8k")) tags.push("8K Video");
  else if (video.includes("4k")) tags.push("4K Video");
  if (video.includes("prores") || video.includes("log")) tags.push("ProRes Log");
  if (tele.includes("5×") || tele.includes("5x")) tags.push("5× Optical Zoom");
  else if (tele.includes("10×") || tele.includes("10x")) tags.push("10× Optical Zoom");
  else if (tele.includes("3×") || tele.includes("3x")) tags.push("3× Optical Zoom");
  if (phone.camera.score >= 95) tags.push("Top-Tier Camera");
  return tags;
}

function getPerfTags(phone: Phone): string[] {
  const tags: string[] = [];
  const chip = phone.performance.chipset.toLowerCase();
  const ram = parseInt(phone.performance.ram);
  if (chip.includes("a18 pro") || chip.includes("a17 pro") || chip.includes("snapdragon 8 elite") || chip.includes("dimensity 9400")) tags.push("Flagship Chip");
  if (chip.includes("a18") || chip.includes("snapdragon 8 elite") || chip.includes("dimensity 9400") || chip.includes("3nm")) tags.push("3nm Process");
  if (!isNaN(ram)) tags.push(`${ram}GB RAM`);
  if (phone.performance.score >= 95) tags.push("Elite Speed");
  return tags;
}

function getBatteryTags(phone: Phone): string[] {
  const tags: string[] = [];
  const charging = phone.battery.charging.toLowerCase();
  const mah = parseInt(phone.battery.capacity.replace(/[^0-9]/g, ""));
  if (mah >= 5000) tags.push("5000+ mAh");
  else if (mah >= 4500) tags.push("4500+ mAh");
  else if (mah >= 4000) tags.push("4000+ mAh");
  if (charging.includes("magsafe") || charging.includes("wireless") || charging.includes("qi")) tags.push("Wireless Charging");
  const wMatch = charging.match(/(\d+)w/i);
  if (wMatch) {
    const w = parseInt(wMatch[1]);
    if (w >= 65) tags.push("Super Fast Charge");
    else if (w >= 30) tags.push("Fast Charging");
  }
  if (phone.battery.score >= 90) tags.push("All-Day Battery");
  return tags;
}

function displaySummary(phone: Phone): string {
  const { size, type, refreshRate } = phone.display;
  const s = phone.displayScore;
  if (s >= 95) return `The ${size} ${type} panel with ${refreshRate} refresh is among the sharpest displays available — vivid colors, fluid motion, and excellent outdoor brightness.`;
  if (s >= 85) return `A premium ${type} screen at ${size} with ${refreshRate} — expect rich colors, deep blacks, and smooth scrolling in all conditions.`;
  return `The ${size} ${type} panel handles everyday use well with solid clarity and ${refreshRate} refresh.`;
}

function cameraSummary(phone: Phone): string {
  const s = phone.camera.score;
  if (s >= 95) return `Elite camera system — the ${phone.camera.main} main sensor, ${phone.camera.telephoto} telephoto, and ${phone.camera.video} video put this among the best. Every focal length delivers.`;
  if (s >= 85) return `A versatile camera trio with ${phone.camera.main} main and ${phone.camera.video} video — ideal for photographers and content creators alike.`;
  return `Solid imaging with ${phone.camera.main} and ${phone.camera.video} support for everyday photography and video.`;
}

function perfSummary(phone: Phone): string {
  const s = phone.performance.score;
  if (s >= 95) return `The ${phone.performance.chipset} with ${phone.performance.ram} is a powerhouse — no game, app, or multitasking scenario will slow it down. Future-proof for years.`;
  if (s >= 85) return `The ${phone.performance.chipset} and ${phone.performance.ram} handle heavy workloads, gaming, and multitasking without hesitation.`;
  return `The ${phone.performance.chipset} and ${phone.performance.ram} deliver smooth everyday performance for most tasks.`;
}

function batterySummary(phone: Phone): string {
  const s = phone.battery.score;
  if (s >= 90) return `The ${phone.battery.capacity} cell is built for marathon days. Combined with ${phone.battery.charging}, top-ups are quick and you rarely hit empty.`;
  if (s >= 80) return `Reliable all-day endurance with a ${phone.battery.capacity} cell and ${phone.battery.charging} — a safe pick for heavy users.`;
  return `The ${phone.battery.capacity} battery covers a typical day with ${phone.battery.charging} available when you need a boost.`;
}

// ── Rich spec section ──────────────────────────────────────────────────────────

interface RichSpecProps {
  title: string;
  icon: ReactNode;
  score?: number;
  tags?: string[];
  rows: { label: string; value: string }[];
  summary?: string;
  delay: number;
}

function RichSpecSection({ title, icon, score, tags, rows, summary, delay }: RichSpecProps) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={delay}
      className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-primary/15 bg-primary/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-serif font-bold text-primary uppercase tracking-widest">{title}</h3>
        </div>
        {score !== undefined && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${score >= 90 ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" : score >= 75 ? "text-amber-400 border-amber-400/30 bg-amber-400/10" : "text-red-400 border-red-400/30 bg-red-400/10"}`}>
            {score}/100
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {score !== undefined && (
          <div className="pb-3 border-b border-border/30">
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-2.5 font-semibold">Score</p>
            <SpecScoreBar score={score} delay={delay + 0.15} />
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border/30">
            {tags.map(tag => <SpecTag key={tag} label={tag} />)}
          </div>
        )}

        <div className="divide-y divide-border/30">
          {rows.map(row => (
            <div key={row.label} className="flex justify-between items-start py-3 gap-6">
              <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{row.label}</span>
              <span className="text-sm text-end font-medium leading-snug">{row.value}</span>
            </div>
          ))}
        </div>

        {summary && (
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed border-s-2 border-primary/30 ps-3 pt-1 italic">
            {summary}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SimilarPhones({ current }: { current: Phone }) {
  const { t } = useLanguage();
  const similar = phones
    .filter(p => p.id !== current.id)
    .map(p => ({ phone: p, diff: Math.abs(p.price - current.price) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 4)
    .map(({ phone }) => phone);

  if (similar.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 pt-10 border-t border-border/50"
    >
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">{t.youMightAlsoLike}</p>
          <h2 className="text-2xl font-serif font-bold">{t.similarPhones}</h2>
        </div>
        <Link href="/browse" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
          {t.browseAll}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similar.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={phonePath(p.id)}>
              <div className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] transition-all duration-300 p-5 flex flex-col items-center cursor-pointer">
                <div className="w-full max-w-[90px] h-32 mb-4">
                  <PhoneIllustration brand={p.brand} name={p.name} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5">{p.brand}</span>
                <p className="text-sm font-semibold text-center leading-snug mb-2 group-hover:text-primary transition-colors">{p.name}</p>
                <p className="text-base font-bold text-primary">${p.price.toLocaleString()}</p>
                <div className="mt-3 flex gap-2 flex-wrap justify-center">
                  {(() => {
                    const avg = Math.round((p.camera.score + p.performance.score + p.battery.score + p.displayScore) / 4);
                    const color = avg >= 80 ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/8" : avg >= 65 ? "text-amber-500 border-amber-500/30 bg-amber-500/8" : "text-red-500 border-red-500/30 bg-red-500/8";
                    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>{avg}/100</span>;
                  })()}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function HumanTranslation({ phone }: { phone: Phone }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleTranslate = async () => {
    setOpen(true);
    if (translation) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate-specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { translation: string };
      setTranslation(data.translation);
    } catch {
      setError("Couldn't translate specs right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleTranslate}
        className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/12 hover:border-primary/60 transition-all duration-300"
      >
        <Languages className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {t.translateToHuman}
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
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-7 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-border/60 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{t.plainEnglish}</p>
                  <h3 className="text-lg font-serif font-bold leading-tight">{phone.brand} {phone.name}</h3>
                </div>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-sm">{t.translatingSpecs}</p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 text-center py-8">{error}</p>
              )}

              {translation && (
                <div className="space-y-3">
                  {translation.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function PhoneDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { setSlotsCount, setSelectedPhoneId } = useComparison();
  const { t } = useLanguage();
  const phone = phones.find(p => p.id === params.id);

  if (!phone) return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground items-center justify-center">
      <p className="text-muted-foreground mb-4">{t.phoneNotFound}</p>
      <Link href="/browse" className="text-primary underline text-sm">{t.backToBrowse}</Link>
    </div>
  );

  const url = getCanonicalUrl(phonePath(phone.id));
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Home", href: "/" }, { name: "Phones", href: "/browse" }, { name: phone.name, href: phonePath(phone.id) }]);
  const handleCompare = () => { setSlotsCount(2); setSelectedPhoneId(0, phone.id); setLocation("/compare"); };

  const scoreBar = (score: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary" />
      </div>
      <span className="text-xs font-semibold text-primary w-12 text-end">{score}/100</span>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Seo title={phoneTitle(phone)} description={phoneDescription(phone)} keywords={phoneKeywords(phone)} url={url} canonical={url} image={phone.imageUrl} jsonLd={[buildPhoneSchema(phone), breadcrumbSchema]} />
      <header className="border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t.back}</span>
        </button>
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary mx-auto">PickyPhone.</Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Phones", href: "/browse" }, { name: phone.name, href: phonePath(phone.id) }]} />
        <div className="grid md:grid-cols-[340px_1fr] gap-8 md:gap-12">

          {/* Left column */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative rounded-3xl border border-border/60 bg-card p-8 flex flex-col items-center shadow-[0_0_60px_-20px_hsl(var(--primary)/0.15)]">
              <div className="w-full max-w-[180px] h-64 mb-5"><PhoneIllustration brand={phone.brand} name={phone.name} /></div>
              <span className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-1">{phone.brand}</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-1">{phone.name}</h1>
              <p className="text-3xl font-bold text-primary mb-1">${phone.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mb-4">{phone.year}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Available Colors</p>
              <div className="flex gap-2.5 flex-wrap justify-center mb-5">
                {phone.colors.map(c => (
                  <div key={c.hex} title={c.name} className="group relative">
                    <div className="w-5 h-5 rounded-full border-2 border-white/10 ring-1 ring-background cursor-pointer hover:ring-2 hover:ring-primary/60 transition-all" style={{ backgroundColor: c.hex }} />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] bg-card border border-border text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{c.name}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {phone.storage.map(s => <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-primary/20 bg-primary/8 text-primary">{s}</span>)}
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-xs font-serif font-bold text-primary uppercase tracking-widest mb-4">Scores</h3>
              {[
                { label: t.camera,      score: phone.camera.score },
                { label: t.performance, score: phone.performance.score },
                { label: t.battery,     score: phone.battery.score },
                { label: t.display,     score: phone.displayScore },
              ].map(({ label, score }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                  {scoreBar(score)}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-3">
              <HumanTranslation phone={phone} />
              <IsItWorthIt phone={phone} />
              <WallpaperButton brand={phone.brand} name={phone.name} />
              <button
                onClick={handleCompare}
                className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-border bg-card text-muted-foreground font-semibold text-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
              >
                <GitCompare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t.compare}
              </button>
              <WatchReviewButton phone={phone} />
            </motion.div>
          </div>

          {/* Right column — specs */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="mb-2">
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">{t.fullSpecifications}</p>
              <h2 className="text-2xl font-serif font-bold">{phone.brand} {phone.name}</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-2xl">{phone.name} is a premium choice for users who want strong specs, modern design, and a clear upgrade path. Use the sections below to compare its display, camera, battery, and performance against the competition.</p>
            </motion.div>

            <RichSpecSection
              title={t.display} delay={0.1}
              icon={<Monitor className="w-4 h-4" />}
              score={phone.displayScore}
              tags={getDisplayTags(phone)}
              summary={displaySummary(phone)}
              rows={[
                { label: t.screenSize,  value: phone.display.size },
                { label: t.resolution,  value: phone.display.resolution },
                { label: t.panelType,   value: phone.display.type },
                { label: t.refreshRate, value: phone.display.refreshRate },
              ]}
            />

            <RichSpecSection
              title={t.performance} delay={0.18}
              icon={<Cpu className="w-4 h-4" />}
              score={phone.performance.score}
              tags={getPerfTags(phone)}
              summary={perfSummary(phone)}
              rows={[
                { label: t.chipset, value: phone.performance.chipset },
                { label: t.ram,     value: phone.performance.ram },
                { label: t.storage, value: phone.storage.join(", ") },
              ]}
            />

            <RichSpecSection
              title={t.camera} delay={0.26}
              icon={<Camera className="w-4 h-4" />}
              score={phone.camera.score}
              tags={getCameraTags(phone)}
              summary={cameraSummary(phone)}
              rows={[
                { label: t.mainCamera,  value: phone.camera.main },
                { label: t.ultrawide,   value: phone.camera.ultrawide },
                { label: t.telephoto,   value: phone.camera.telephoto },
                { label: t.video,       value: phone.camera.video },
              ]}
            />

            <RichSpecSection
              title={t.battery} delay={0.34}
              icon={<BatteryCharging className="w-4 h-4" />}
              score={phone.battery.score}
              tags={getBatteryTags(phone)}
              summary={batterySummary(phone)}
              rows={[
                { label: t.capacity, value: phone.battery.capacity },
                { label: t.charging, value: phone.battery.charging },
              ]}
            />

            <RichSpecSection
              title={t.connectivityOther} delay={0.42}
              icon={<Layers className="w-4 h-4" />}
              rows={[
                { label: t.colorsAvailable, value: phone.colors.map(c => c.name).join(", ") },
                { label: t.releaseYear,     value: String(phone.year) },
                { label: "Storage Options", value: phone.storage.join(" / ") },
              ]}
            />
          </div>
        </div>

        <SimilarPhones current={phone} />
      </main>
      <Footer />
    </div>
  );
}
