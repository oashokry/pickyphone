import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  isWinner?: boolean;
  delay?: number;
}

export default function SpecRow({ label, value, isWinner = false, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col py-3 border-b border-border/40 last:border-0 transition-colors duration-300",
        isWinner && "pl-3"
      )}
    >
      {/* Gold left accent bar for winners */}
      {isWinner && (
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.1, ease: "easeOut" }}
          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary origin-top"
        />
      )}

      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">
        {label}
      </span>

      <span
        className={cn(
          "text-sm font-medium leading-snug",
          isWinner
            ? "text-primary font-bold"
            : "text-foreground/90"
        )}
      >
        {isWinner && (
          <span className="inline-block mr-1.5 text-primary text-xs">★</span>
        )}
        {value}
      </span>
    </motion.div>
  );
}
