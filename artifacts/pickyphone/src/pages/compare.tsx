import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useComparison } from "@/context/ComparisonContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Priority } from "@/lib/recommendation";
import { Camera, Cpu, Battery, Monitor, DollarSign, Scale } from "lucide-react";
import Footer from "@/components/Footer";
import SearchablePhoneSelect from "@/components/SearchablePhoneSelect";
import { phones } from "@/data/phones";

const priorities: { value: Priority; label: string; icon: any }[] = [
  { value: "camera", label: "Camera", icon: Camera },
  { value: "performance", label: "Performance", icon: Cpu },
  { value: "battery", label: "Battery", icon: Battery },
  { value: "display", label: "Display", icon: Monitor },
  { value: "price", label: "Price", icon: DollarSign },
  { value: "balanced", label: "Balanced", icon: Scale },
];

export default function Compare() {
  const [, setLocation] = useLocation();
  const { slotsCount, setSlotsCount, selectedPhoneIds, setSelectedPhoneId, priority, setPriority } = useComparison();

  const isReady = selectedPhoneIds.every(id => id !== null);

  const handleCompare = () => {
    if (isReady) {
      const ids = selectedPhoneIds.filter(Boolean).join(",");
      setLocation(`/results?phones=${ids}&priority=${priority}`);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 p-6 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 space-y-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-serif font-bold mb-2">Configure Comparison</h1>
          <p className="text-muted-foreground text-lg">Select the devices and what matters most to you.</p>
        </motion.div>

        {/* Step 1 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">1</span>
            <h2 className="text-2xl font-serif">How many phones?</h2>
          </div>
          <div className="flex gap-4">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setSlotsCount(num)}
                data-testid={`btn-slots-${num}`}
                className={`flex-1 py-4 rounded-xl border transition-all duration-300 font-medium ${
                  slotsCount === num 
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]" 
                    : "bg-card border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {num} Phones
              </button>
            ))}
          </div>
        </motion.section>

        {/* Step 2 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">2</span>
            <h2 className="text-2xl font-serif">Select Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: slotsCount }).map((_, idx) => (
              <Card key={idx} className="p-4 bg-card border-border">
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">Slot {idx + 1}</label>
                <SearchablePhoneSelect
                  phones={phones}
                  selectedId={selectedPhoneIds[idx]}
                  onSelect={(id) => setSelectedPhoneId(idx, id)}
                  placeholder="Search a phone..."
                />
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Step 3 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm border border-primary/20">3</span>
            <h2 className="text-2xl font-serif">Priority</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {priorities.map(p => {
              const Icon = p.icon;
              const isSelected = priority === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  data-testid={`btn-priority-${p.value}`}
                  className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium text-sm">{p.label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-8 flex justify-end">
          <Button
            size="lg"
            disabled={!isReady}
            onClick={handleCompare}
            data-testid="btn-compare-now"
            className="w-full md:w-auto px-12 py-6 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all"
          >
            Compare Now
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
