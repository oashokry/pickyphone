import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/1777731629527_1777733390040.png";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center max-w-3xl"
        >
          <div className="bg-card/50 p-4 rounded-3xl border border-border shadow-2xl shadow-primary/10 mb-10 backdrop-blur-sm">
            <img 
              src={logoPath} 
              alt="PickyPhone Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">
            PickyPhone <span className="text-primary italic font-light block mt-2">The Smart Choice</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light tracking-wide">
            Compare. Decide. Own It.
          </p>

          <Link href="/compare">
            <Button 
              size="lg" 
              className="rounded-full px-10 py-8 text-lg font-medium shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-10px_hsl(var(--primary))] transition-all duration-500 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-start-comparing"
            >
              Start Comparing
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl text-left"
        >
          <div className="p-6 border border-border/50 rounded-2xl bg-card/30">
            <h3 className="text-primary font-serif text-xl font-medium mb-3">Unbiased Data</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">We aggregate raw specs, performance metrics, and real-world scores to give you the truth.</p>
          </div>
          <div className="p-6 border border-border/50 rounded-2xl bg-card/30">
            <h3 className="text-primary font-serif text-xl font-medium mb-3">Side-by-Side</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">Compare up to four flagship devices simultaneously with our dense, beautifully crafted spec grid.</p>
          </div>
          <div className="p-6 border border-border/50 rounded-2xl bg-card/30">
            <h3 className="text-primary font-serif text-xl font-medium mb-3">Smart Verdicts</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">Tell us what matters most—camera, battery, or price—and let our engine declare the winner.</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
