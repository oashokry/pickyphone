import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, GitCompare, Sparkles, Languages, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { phones, type Phone } from "@/data/phones";
import { useComparison } from "@/context/ComparisonContext";
import PhoneIllustration from "@/components/PhoneIllustration";
import { WatchReviewButton } from "@/components/ReviewButtons";
import WallpaperButton from "@/components/WallpaperButton";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbSchema, buildPhoneSchema, getCanonicalUrl, phoneDescription, phoneKeywords, phonePath, phoneTitle } from "@/lib/seo";
import { useLanguage, LanguageToggle } from "@/context/LanguageContext";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] } }) };

function SpecSection({ title, rows, delay }: { title: string; rows: { label: string; value: string }[]; delay: number }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={delay} className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-primary/15 bg-primary/5">
        <h3 className="text-xs font-serif font-bold text-primary uppercase tracking-widest">{title}</h3>
      </div>
      <div className="divide-y divide-border/40">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between items-center px-5 py-3 gap-4">
            <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
            <span className="text-sm text-end font-medium leading-snug">{row.value}</span>
          </div>
        ))}
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

            <SpecSection title={t.display} delay={0.1} rows={[
              { label: t.screenSize,    value: phone.display.size },
              { label: t.resolution,    value: phone.display.resolution },
              { label: t.panelType,     value: phone.display.type },
              { label: t.refreshRate,   value: phone.display.refreshRate },
              { label: t.displayScore,  value: `${phone.displayScore}/100` },
            ]} />

            <SpecSection title={t.performance} delay={0.18} rows={[
              { label: t.chipset,          value: phone.performance.chipset },
              { label: t.ram,              value: phone.performance.ram },
              { label: t.storage,          value: phone.storage.join(", ") },
              { label: t.performanceScore, value: `${phone.performance.score}/100` },
            ]} />

            <SpecSection title={t.camera} delay={0.26} rows={[
              { label: t.mainCamera,   value: phone.camera.main },
              { label: t.ultrawide,    value: phone.camera.ultrawide },
              { label: t.telephoto,    value: phone.camera.telephoto },
              { label: t.video,        value: phone.camera.video },
              { label: t.cameraScore,  value: `${phone.camera.score}/100` },
            ]} />

            <SpecSection title={t.battery} delay={0.34} rows={[
              { label: t.capacity,      value: phone.battery.capacity },
              { label: t.charging,      value: phone.battery.charging },
              { label: t.batteryScore,  value: `${phone.battery.score}/100` },
            ]} />

            <SpecSection title={t.connectivityOther} delay={0.42} rows={[
              { label: t.colorsAvailable, value: phone.colors.map(c => c.name).join(", ") },
              { label: t.releaseYear,     value: String(phone.year) },
            ]} />
          </div>
        </div>

        <SimilarPhones current={phone} />
      </main>
      <Footer />
    </div>
  );
}
