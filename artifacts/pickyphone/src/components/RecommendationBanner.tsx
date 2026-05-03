import { motion } from "framer-motion";
import { Phone } from "@/data/phones";
import PhoneIllustration from "./PhoneIllustration";

interface Props {
  phone: Phone;
  reason: string;
}

export default function RecommendationBanner({ phone, reason }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 mt-12 mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"
        animate={{ translateX: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 md:w-28 shrink-0">
          <PhoneIllustration brand={phone.brand} name={phone.name} />
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase rounded-full border border-primary/30 mb-4">
            Best Choice
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            {phone.brand} {phone.name}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            {reason}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end">
          <span className="text-3xl font-light">${phone.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
