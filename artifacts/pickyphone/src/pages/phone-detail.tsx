import { motion } from "framer-motion";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, GitCompare, Sparkles } from "lucide-react";
import { phones } from "@/data/phones";
import { useComparison } from "@/context/ComparisonContext";
import PhoneIllustration from "@/components/PhoneIllustration";
import { WatchReviewButton } from "@/components/ReviewButtons";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface SpecSectionProps {
  title: string;
  rows: { label: string; value: string }[];
  delay: number;
}

function SpecSection({ title, rows, delay }: SpecSectionProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={delay}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-primary/15 bg-primary/5">
        <h3 className="text-xs font-serif font-bold text-primary uppercase tracking-widest">{title}</h3>
      </div>
      <div className="divide-y divide-border/40">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between items-center px-5 py-3 gap-4">
            <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
            <span className="text-sm text-right font-medium leading-snug">{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PhoneDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { setSlotsCount, setSelectedPhoneId } = useComparison();

  const phone = phones.find(p => p.id === params.id);

  if (!phone) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground items-center justify-center">
        <p className="text-muted-foreground mb-4">Phone not found.</p>
        <Link href="/browse" className="text-primary underline text-sm">← Back to Browse</Link>
      </div>
    );
  }

  const handleCompare = () => {
    setSlotsCount(2);
    setSelectedPhoneId(0, phone.id);
    setLocation("/compare");
  };

  const scoreBar = (score: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
        />
      </div>
      <span className="text-xs font-semibold text-primary w-12 text-right">{score}/100</span>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border/40 px-5 py-4 flex items-center gap-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary mx-auto">PickyPhone.</Link>
        <div className="w-20 hidden sm:block" />
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-[340px_1fr] gap-8 md:gap-12">

          {/* ── Left: Hero panel ── */}
          <div className="flex flex-col gap-6">
            {/* Illustration hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border border-border/60 bg-card p-8 flex flex-col items-center
                shadow-[0_0_60px_-20px_hsl(var(--primary)/0.15)]"
            >
              <div className="w-full max-w-[180px] h-64 mb-5">
                <PhoneIllustration brand={phone.brand} name={phone.name} />
              </div>

              <span className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-1">
                {phone.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-1">{phone.name}</h1>
              <p className="text-3xl font-bold text-primary mb-1">${phone.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mb-4">{phone.year}</p>

              {/* Color swatches */}
              <div className="flex gap-2.5 flex-wrap justify-center mb-5">
                {phone.colors.map(c => (
                  <div
                    key={c.hex}
                    title={c.name}
                    className="group relative"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white/10 ring-1 ring-background cursor-pointer
                        hover:ring-2 hover:ring-primary/60 transition-all"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px]
                      bg-card border border-border text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100
                      transition-opacity pointer-events-none z-10">
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Storage chips */}
              <div className="flex gap-2 flex-wrap justify-center">
                {phone.storage.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-primary/20 bg-primary/8 text-primary">
                    {s}
                  </span>
                ))}
              </div>

              {/* Gold bottom glow */}
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </motion.div>

            {/* Score summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-card p-5 space-y-3"
            >
              <h3 className="text-xs font-serif font-bold text-primary uppercase tracking-widest mb-4">Score Summary</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Camera</span>
                  </div>
                  {scoreBar(phone.camera.score)}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Performance</span>
                  </div>
                  {scoreBar(phone.performance.score)}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Battery</span>
                  </div>
                  {scoreBar(phone.battery.score)}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Display</span>
                  </div>
                  {scoreBar(phone.displayScore)}
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <Link href={`/analyze/${phone.id}`}>
                <button className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full
                  bg-primary text-primary-foreground font-semibold text-sm
                  shadow-[0_0_28px_-6px_hsl(var(--primary)/0.5)]
                  hover:bg-primary/90 hover:shadow-[0_0_40px_-6px_hsl(var(--primary)/0.6)]
                  transition-all duration-300">
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Is It Worth It?
                </button>
              </Link>

              <button
                onClick={handleCompare}
                className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full
                  border border-border bg-card text-foreground font-semibold text-sm
                  hover:border-primary/50 hover:text-primary hover:bg-primary/8
                  transition-all duration-300"
              >
                <GitCompare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Compare with Another
              </button>

              <div className="flex justify-center pt-1">
                <WatchReviewButton phone={phone} />
              </div>
            </motion.div>
          </div>

          {/* ── Right: Full specs ── */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-2"
            >
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">Full Specifications</p>
              <h2 className="text-2xl font-serif font-bold">{phone.brand} {phone.name}</h2>
            </motion.div>

            <SpecSection
              title="Display"
              delay={0.1}
              rows={[
                { label: "Screen Size", value: phone.display.size },
                { label: "Resolution", value: phone.display.resolution },
                { label: "Panel Type", value: phone.display.type },
                { label: "Refresh Rate", value: phone.display.refreshRate },
                { label: "Display Score", value: `${phone.displayScore}/100` },
              ]}
            />

            <SpecSection
              title="Performance"
              delay={0.18}
              rows={[
                { label: "Chipset", value: phone.performance.chipset },
                { label: "RAM", value: phone.performance.ram },
                { label: "Storage", value: phone.storage.join(", ") },
                { label: "Performance Score", value: `${phone.performance.score}/100` },
              ]}
            />

            <SpecSection
              title="Camera"
              delay={0.26}
              rows={[
                { label: "Main Camera", value: phone.camera.main },
                { label: "Ultrawide", value: phone.camera.ultrawide },
                { label: "Telephoto", value: phone.camera.telephoto },
                { label: "Video", value: phone.camera.video },
                { label: "Camera Score", value: `${phone.camera.score}/100` },
              ]}
            />

            <SpecSection
              title="Battery"
              delay={0.34}
              rows={[
                { label: "Capacity", value: phone.battery.capacity },
                { label: "Charging", value: phone.battery.charging },
                { label: "Battery Score", value: `${phone.battery.score}/100` },
              ]}
            />

            <SpecSection
              title="Connectivity & Other"
              delay={0.42}
              rows={[
                { label: "Colors Available", value: phone.colors.map(c => c.name).join(", ") },
                { label: "Release Year", value: String(phone.year) },
                { label: "Price (2026)", value: `$${phone.price.toLocaleString()}` },
              ]}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
