import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Phone } from "@/data/phones";
import PhoneIllustration from "./PhoneIllustration";
import { WatchReviewButton } from "./ReviewButtons";

interface Props {
  phone: Phone;
  reason: string;
}

export default function RecommendationBanner({ phone, reason }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-primary/30
        bg-gradient-to-br from-card via-card to-primary/5
        shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)] mt-8 mb-8"
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-10">
        {/* Illustration */}
        <div className="w-20 sm:w-28 shrink-0">
          <PhoneIllustration brand={phone.brand} name={phone.name} />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Best Choice</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight">
            {phone.brand} <span className="text-primary">{phone.name}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mb-4">
            {reason}
          </p>
          <WatchReviewButton phone={phone} />
        </div>

        {/* Price callout */}
        <div className="shrink-0 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Price</p>
          <p className="text-3xl font-serif font-bold text-primary">${phone.price.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}
