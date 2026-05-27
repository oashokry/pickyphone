import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Layers, Zap, Search } from "lucide-react";
import logoPath from "@assets/logo_transparent.png";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getCanonicalUrl, homeDescription, homeKeywords, homeTitle } from "@/lib/seo";
import { useLanguage, LanguageToggle } from "@/context/LanguageContext";
import { useComparison } from "@/context/ComparisonContext";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

export default function Home() {
  const { t } = useLanguage();
  const { resetComparison } = useComparison();

  useEffect(() => {
    resetComparison();
  }, []);
  const url = getCanonicalUrl("/");

  const FEATURES = [
    { icon: BarChart3, title: t.featureUnbiasedTitle, desc: t.featureUnbiasedDesc },
    { icon: Layers,    title: t.featureSideBySideTitle, desc: t.featureSideBySideDesc },
    { icon: Zap,       title: t.featureSmartVerdictsTitle, desc: t.featureSmartVerdictsDesc },
    { icon: Search,    title: t.featureBrowseAnalyzeTitle, desc: t.featureBrowseAnalyzeDesc },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Seo title={homeTitle()} description={homeDescription()} keywords={homeKeywords()} url={url} canonical={url} />

      {/* Header with language toggle */}
      <header className="relative z-20 flex justify-end px-5 py-4">
        <LanguageToggle />
      </header>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(43 65% 53% / 0.08) 0%, transparent 70%)" }} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center max-w-2xl w-full">
          <motion.img src={logoPath} alt="PickyPhone" loading="eager" decoding="async" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="w-56 h-40 sm:w-72 sm:h-52 object-contain mb-4 drop-shadow-[0_0_60px_rgba(212,175,55,0.50)]" />
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight mb-3 leading-tight">PickyPhone</h1>
          <p className="text-xl sm:text-2xl text-primary italic font-light mb-4 tracking-wide">{t.homeTagline}</p>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md font-light">{t.homeDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/compare">
              <Button size="lg" data-testid="button-start-comparing" className="group rounded-full px-10 py-7 text-lg font-semibold bg-primary text-primary-foreground shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_65px_-8px_hsl(var(--primary))] hover:bg-primary/90 transition-all duration-500">
                {t.startComparing}
                <ArrowRight className="ms-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-x-1 transition-transform duration-300 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="group rounded-full px-8 py-7 text-base font-semibold border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/8 transition-all duration-400">
                <Search className="me-2 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {t.browsePhones}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl w-full text-start">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="group p-6 rounded-2xl border border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_0_25px_-8px_hsl(var(--primary)/0.25)] transition-all duration-400">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="text-primary font-serif text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }} className="mt-20 w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </main>

      <Footer />
    </div>
  );
}
