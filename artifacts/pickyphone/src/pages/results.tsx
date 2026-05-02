import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useComparison } from "@/context/ComparisonContext";
import { phones as dbPhones, Phone } from "@/data/phones";
import { getBestPhone } from "@/lib/recommendation";
import PhoneCard from "@/components/PhoneCard";
import RecommendationBanner from "@/components/RecommendationBanner";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Results() {
  const [, setLocation] = useLocation();
  const { selectedPhoneIds, priority } = useComparison();
  const [loading, setLoading] = useState(true);

  const selectedPhones = selectedPhoneIds
    .filter(id => id !== null)
    .map(id => dbPhones.find(p => p.id === id))
    .filter(Boolean) as Phone[];

  useEffect(() => {
    if (selectedPhones.length === 0) {
      setLocation("/compare");
      return;
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedPhones.length, setLocation]);

  if (selectedPhones.length === 0) return null;

  const recommendation = !loading ? getBestPhone(selectedPhones, priority) : null;

  // Calculate winners
  const winners = {
    price: selectedPhones.reduce((min, p) => p.price < min.price ? p : min, selectedPhones[0]).id,
    displayScore: selectedPhones.reduce((max, p) => p.displayScore > max.displayScore ? p : max, selectedPhones[0]).id,
    cameraScore: selectedPhones.reduce((max, p) => p.camera.score > max.camera.score ? p : max, selectedPhones[0]).id,
    performanceScore: selectedPhones.reduce((max, p) => p.performance.score > max.performance.score ? p : max, selectedPhones[0]).id,
    batteryScore: selectedPhones.reduce((max, p) => p.battery.score > max.battery.score ? p : max, selectedPhones[0]).id,
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border/40 p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/compare" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <Skeleton className="h-48 w-full rounded-2xl bg-card" />
            <div className={`grid grid-cols-1 md:grid-cols-${selectedPhones.length} gap-6`}>
              {selectedPhones.map(p => (
                <Skeleton key={p.id} className="h-[800px] rounded-2xl bg-card" />
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {recommendation && (
              <RecommendationBanner phone={recommendation.phone} reason={recommendation.reason} />
            )}

            <div className="mt-16 mb-6">
              <h2 className="text-2xl font-serif border-b border-border/50 pb-4 inline-block">Detailed Comparison</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedPhones.map((phone, i) => (
                <motion.div
                  key={phone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6 }}
                >
                  <PhoneCard phone={phone} winners={winners} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
