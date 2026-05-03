import { useState } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Camera, Cpu, Battery, Monitor, DollarSign, Scale,
  Gamepad2, Sun, Briefcase, Aperture, Shuffle, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/ComparisonContext";
import { Priority, UsageType } from "@/lib/recommendation";
import Footer from "@/components/Footer";

const USAGE_OPTIONS: { value: UsageType; label: string; icon: any; desc: string }[] = [
  { value: "Gaming",      label: "Gaming",      icon: Gamepad2,  desc: "High refresh rate & top performance" },
  { value: "Casual",      label: "Casual",      icon: Sun,       desc: "Battery & everyday reliability" },
  { value: "Work",        label: "Work",        icon: Briefcase, desc: "Multitasking & all-day power" },
  { value: "Photography", label: "Photography", icon: Aperture,  desc: "Camera quality above all" },
  { value: "Mixed",       label: "Mixed",       icon: Shuffle,   desc: "Balanced across everything" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; icon: any }[] = [
  { value: "camera",      label: "Camera",      icon: Camera },
  { value: "performance", label: "Performance", icon: Cpu },
  { value: "battery",     label: "Battery",     icon: Battery },
  { value: "display",     label: "Display",     icon: Monitor },
  { value: "price",       label: "Price",       icon: DollarSign },
  { value: "balanced",    label: "Balanced",    icon: Scale },
];

const BUDGET_MIN = 0;
const BUDGET_MAX = 2000;
const STEP = 50;

function DualRangeSlider({
  value, onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pctLo = ((lo - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const pctHi = ((hi - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <div className="relative h-8 flex items-center select-none">
      {/* Track */}
      <div className="absolute left-0 right-0 h-1.5 bg-border rounded-full">
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
        />
      </div>

      {/* Min thumb */}
      <input
        type="range"
        min={BUDGET_MIN} max={BUDGET_MAX} step={STEP}
        value={lo}
        onChange={e => {
          const v = Math.min(Number(e.target.value), hi - 100);
          onChange([v, hi]);
        }}
        className="absolute w-full appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
        style={{ zIndex: lo > BUDGET_MAX - 200 ? 5 : 3 }}
      />

      {/* Max thumb */}
      <input
        type="range"
        min={BUDGET_MIN} max={BUDGET_MAX} step={STEP}
        value={hi}
        onChange={e => {
          const v = Math.max(Number(e.target.value), lo + 100);
          onChange([lo, v]);
        }}
        className="absolute w-full appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}

export default function Preferences() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const phonesParam = params.get("phones") ?? "";

  const {
    priority, setPriority,
    budget, setBudget,
    usageType, setUsageType,
  } = useComparison();

  const handleContinue = () => {
    const budgetStr = `${budget[0]}-${budget[1]}`;
    setLocation(`/results?phones=${phonesParam}&priority=${priority}&budget=${budgetStr}&usage=${usageType}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 p-6 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link
          href={`/compare`}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
        <span className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</span>
        <div />
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 space-y-14">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Personalise</p>
          <h1 className="text-4xl font-serif font-bold mb-2">What matters to you?</h1>
          <p className="text-muted-foreground text-lg">Tell us your priorities and we'll score each phone for you.</p>
        </motion.div>

        {/* Budget */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">1</span>
            <h2 className="text-2xl font-serif">Budget Range</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Min</p>
                <p className="text-2xl font-bold text-primary">${budget[0].toLocaleString()}</p>
              </div>
              <div className="text-muted-foreground text-sm">—</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Max</p>
                <p className="text-2xl font-bold text-primary">${budget[1].toLocaleString()}</p>
              </div>
            </div>

            <DualRangeSlider value={budget} onChange={setBudget} />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$500</span>
              <span>$1,000</span>
              <span>$1,500</span>
              <span>$2,000</span>
            </div>
          </div>
        </motion.section>

        {/* Usage type */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">2</span>
            <h2 className="text-2xl font-serif">Usage Type</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {USAGE_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = usageType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setUsageType(opt.value)}
                  className={`p-5 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 text-center ${
                    active
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Priority */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">3</span>
            <h2 className="text-2xl font-serif">Top Priority</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRIORITY_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = priority === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`p-5 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                    active
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium text-sm">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-4 flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full md:w-auto px-12 py-6 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all"
          >
            See My Results
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
