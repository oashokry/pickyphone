import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useComparison } from "@/context/ComparisonContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Priority } from "@/lib/scoring";
import { Camera, Cpu, Battery, Monitor, DollarSign, Scale } from "lucide-react";
import Footer from "@/components/Footer";
import SearchablePhoneSelect from "@/components/SearchablePhoneSelect";
import { phones } from "@/data/phones";
import { useLanguage, LanguageToggle } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Compare() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const {
    slotsCount, setSlotsCount,
    selectedPhoneIds, setSelectedPhoneId,
    priority, setPriority,
  } = useComparison();

  const PRIORITIES: { value: Priority; label: string; icon: any }[] = [
    { value: "camera",      label: t.camera,      icon: Camera },
    { value: "performance", label: t.performance, icon: Cpu },
    { value: "battery",     label: t.battery,     icon: Battery },
    { value: "display",     label: t.display,     icon: Monitor },
    { value: "price",       label: t.price,       icon: DollarSign },
    { value: "balanced",    label: t.balanced,    icon: Scale },
  ];

  const isReady = selectedPhoneIds.slice(0, slotsCount).every(id => id !== null);

  const handlePersonalise = () => {
    if (!isReady) return;
    const ids = selectedPhoneIds.filter(Boolean).join(",");
    setLocation(`/preferences?phones=${ids}`);
  };

  const handleSkip = () => {
    if (!isReady) return;
    const ids = selectedPhoneIds.filter(Boolean).join(",");
    setLocation(`/results?phones=${ids}&priority=${priority}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 px-5 py-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-8 md:px-12 md:py-14 space-y-14">

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">{t.compareLabel}</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{t.buildYourComparison}</h1>
          <p className="text-muted-foreground text-base sm:text-lg">{t.pickDevices}</p>
        </motion.div>

        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.08} className="space-y-5">
          <StepLabel n={1} text={t.howManyPhones} />
          <div className="flex gap-3">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setSlotsCount(num)}
                data-testid={`btn-slots-${num}`}
                className={`flex-1 py-4 rounded-xl border font-medium text-sm transition-all duration-300 ${
                  slotsCount === num
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_14px_-4px_hsl(var(--primary)/0.35)]"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {t.phonesCount(num)}
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.16} className="space-y-5">
          <StepLabel n={2} text={t.selectDevices} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: slotsCount }).map((_, idx) => (
              <Card key={idx} className="p-4 bg-card border-border">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block font-semibold">
                  {t.phoneN(idx + 1)}
                </label>
                <SearchablePhoneSelect
                  phones={phones}
                  selectedId={selectedPhoneIds[idx]}
                  onSelect={id => setSelectedPhoneId(idx, id)}
                  placeholder={t.searchBrandModel}
                />
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.24} className="space-y-5">
          <StepLabel n={3} text={t.quickPriority} sub={t.quickPrioritySub} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRIORITIES.map(p => {
              const Icon = p.icon;
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  data-testid={`btn-priority-${p.value}`}
                  className={`p-5 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-300 ${
                    active
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_14px_-4px_hsl(var(--primary)/0.35)]"
                      : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-xs sm:text-sm">{p.label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0.32}
          className="pt-6 flex flex-col sm:flex-row gap-3 justify-end"
        >
          <Button
            size="lg"
            variant="outline"
            disabled={!isReady}
            onClick={handleSkip}
            className="sm:w-auto px-8 py-6 rounded-full text-sm border-border text-muted-foreground
              hover:border-primary/40 hover:text-primary disabled:opacity-40 transition-all"
          >
            {t.skipCompareOnly}
          </Button>
          <Button
            size="lg"
            disabled={!isReady}
            onClick={handlePersonalise}
            data-testid="btn-compare-now"
            className="sm:w-auto px-10 py-6 rounded-full text-base font-semibold
              bg-primary text-primary-foreground hover:bg-primary/90
              disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none
              shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-400"
          >
            {t.personaliseCompare}
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function StepLabel({ n, text, sub }: { n: number; text: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20 shrink-0">
        {n}
      </span>
      <h2 className="text-xl sm:text-2xl font-serif">{text}
        {sub && <span className="ms-2 text-muted-foreground text-sm sm:text-base font-sans font-normal">{sub}</span>}
      </h2>
    </div>
  );
}
