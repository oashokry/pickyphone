import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Layers, Zap } from "lucide-react";
import logoPath from "@assets/logo_transparent.png";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Unbiased Data",
    desc: "Raw specs, real-world scores, and 2026 market prices across 50+ flagship devices.",
  },
  {
    icon: Layers,
    title: "Side-by-Side",
    desc: "Compare up to four phones at once with our dense, gold-highlighted spec grid.",
  },
  {
    icon: Zap,
    title: "Smart Verdicts",
    desc: "Tell us what matters—camera, battery, price—and we'll declare a clear winner.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">

      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(43 65% 53% / 0.08) 0%, transparent 70%)",
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center max-w-2xl w-full"
        >
          <motion.img
            src={logoPath}
            alt="PickyPhone"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 h-80 sm:w-96 sm:h-96 object-contain mb-2
              drop-shadow-[0_0_80px_rgba(212,175,55,0.55)]"
          />

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight mb-3 leading-tight">
            PickyPhone
          </h1>
          <p className="text-xl sm:text-2xl text-primary italic font-light mb-4 tracking-wide">
            The Smart Choice
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md font-light">
            Compare the world's best smartphones side by side. Find your perfect match in under two minutes.
          </p>

          <Link href="/compare">
            <Button
              size="lg"
              data-testid="button-start-comparing"
              className="group rounded-full px-10 py-7 text-lg font-semibold
                bg-primary text-primary-foreground
                shadow-[0_0_40px_-10px_hsl(var(--primary))]
                hover:shadow-[0_0_65px_-8px_hsl(var(--primary))]
                hover:bg-primary/90 transition-all duration-500"
            >
              Start Comparing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>

        {/* ── Feature cards ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl w-full text-left"
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group p-6 rounded-2xl border border-border/50 bg-card/40
                hover:border-primary/30 hover:bg-card/70
                hover:shadow-[0_0_25px_-8px_hsl(var(--primary)/0.25)]
                transition-all duration-400"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="text-primary font-serif text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
          className="mt-20 w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </main>

      <Footer />
    </div>
  );
}
