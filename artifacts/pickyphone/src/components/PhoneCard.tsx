import { motion } from "framer-motion";
import { Phone } from "@/data/phones";
import SpecRow from "./SpecRow";
import PhoneIllustration from "./PhoneIllustration";
import { WatchReviewButton } from "./ReviewButtons";
import WallpaperButton from "./WallpaperButton";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  phone: Phone;
  winners: {
    price: string;
    displayScore: string;
    cameraScore: string;
    performanceScore: string;
    batteryScore: string;
  };
  matchPct?: number;
  animationDelay?: number;
}

function MatchBadge({ pct }: { pct: number }) {
  const { t } = useLanguage();
  const style =
    pct >= 90 ? "text-primary border-primary/50 bg-primary/10 shadow-[0_0_12px_-4px_hsl(var(--primary)/0.6)]" :
    pct >= 75 ? "text-amber-400 border-amber-400/50 bg-amber-400/10" :
                "text-orange-400 border-orange-400/50 bg-orange-400/10";
  return (
    <div className={`absolute top-3 end-3 px-2.5 py-1 rounded-full border text-xs font-bold tracking-wide ${style}`}>
      {pct}% {t.match}
    </div>
  );
}

export default function PhoneCard({ phone, winners, matchPct, animationDelay = 0 }: Props) {
  const { t } = useLanguage();
  const isPriceWinner = winners.price === phone.id;

  const SECTION_GROUPS = [
    {
      title: t.display,
      rows: (p: Phone, w: Props["winners"]) => [
        { label: t.specSize,       value: p.display.size },
        { label: t.resolution,     value: p.display.resolution },
        { label: t.specType,       value: p.display.type },
        { label: t.refreshRate,    value: p.display.refreshRate },
        { label: t.qualityScore,   value: `${p.displayScore}/100`,      isWinner: w.displayScore === p.id },
      ],
    },
    {
      title: t.performance,
      rows: (p: Phone, w: Props["winners"]) => [
        { label: t.chipset,     value: p.performance.chipset },
        { label: t.specRam,     value: p.performance.ram },
        { label: t.powerScore,  value: `${p.performance.score}/100`, isWinner: w.performanceScore === p.id },
      ],
    },
    {
      title: t.camera,
      rows: (p: Phone, w: Props["winners"]) => [
        { label: t.specMain,        value: p.camera.main },
        { label: t.specUltrawide,   value: p.camera.ultrawide },
        { label: t.specTelephoto,   value: p.camera.telephoto },
        { label: t.specVideo,       value: p.camera.video },
        { label: t.opticsScore,     value: `${p.camera.score}/100`, isWinner: w.cameraScore === p.id },
      ],
    },
    {
      title: t.battery,
      rows: (p: Phone, w: Props["winners"]) => [
        { label: t.specCapacity,      value: p.battery.capacity },
        { label: t.specCharging,      value: p.battery.charging },
        { label: t.enduranceScore,    value: `${p.battery.score}/100`, isWinner: w.batteryScore === p.id },
      ],
    },
    {
      title: t.storage,
      rows: (p: Phone, _w: Props["winners"]) => [
        { label: t.specOptions, value: p.storage.join(", ") },
      ],
    },
  ] as const satisfies { title: string; rows: (p: Phone, w: Props["winners"]) => { label: string; value: string; isWinner?: boolean }[] }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: animationDelay, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col bg-card rounded-2xl border border-border shadow-md
        hover:border-primary/25 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]
        transition-all duration-500 overflow-hidden group"
    >
      {matchPct !== undefined && <MatchBadge pct={matchPct} />}

      <div className="p-5 pb-0 flex flex-col items-center text-center">
        <div className="w-full h-40 sm:h-48 mb-5 flex items-center justify-center px-6">
          <PhoneIllustration brand={phone.brand} name={phone.name} />
        </div>

        <span className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-1.5">
          {phone.brand}
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1.5 leading-tight">{phone.name}</h3>

        <p className={`text-lg font-semibold mb-0.5 ${isPriceWinner ? "text-primary" : "text-foreground/80"}`}>
          {isPriceWinner && <span className="text-xs me-1">★</span>}
          ${phone.price.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mb-4">{phone.year}</p>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {phone.colors.map(color => (
            <div
              key={color.hex}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-white/10 ring-1 ring-background"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      <div className="p-5 bg-background/40 flex-1 flex flex-col gap-6 text-start border-t border-border/40">
        <div className="flex flex-col gap-2">
          <WatchReviewButton phone={phone} />
          <WallpaperButton brand={phone.brand} name={phone.name} variant="compact" />
        </div>

        {SECTION_GROUPS.map((section, si) => {
          const rows = section.rows(phone, winners);
          return (
            <div key={section.title}>
              <h4 className="text-xs font-serif font-bold text-primary mb-2 pb-2 border-b border-primary/15 uppercase tracking-widest">
                {section.title}
              </h4>
              {rows.map((row, ri) => (
                <SpecRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  isWinner={"isWinner" in row ? (row.isWinner as boolean) : false}
                  delay={(si * rows.length + ri) * 0.03 + animationDelay + 0.1}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
