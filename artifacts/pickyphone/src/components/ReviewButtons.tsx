import { PlayCircle, Film } from "lucide-react";
import { Phone } from "@/data/phones";
import { useLanguage } from "@/context/LanguageContext";

function buildReviewUrl(phone: Phone): string {
  const query = `${phone.brand} ${phone.name} review`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function buildComparisonUrl(phones: Phone[]): string {
  const names = phones.map(p => `${p.brand} ${p.name}`).join(" vs ");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${names} review`)}`;
}

interface ReviewButtonProps {
  phone: Phone;
}

export function WatchReviewButton({ phone }: ReviewButtonProps) {
  const { t } = useLanguage();
  const handleClick = () => window.open(buildReviewUrl(phone), "_blank", "noopener,noreferrer");

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
        border border-primary/40 bg-primary/8
        text-primary text-sm font-semibold
        hover:bg-primary hover:text-primary-foreground hover:border-primary
        hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.6)]
        transition-all duration-300 cursor-pointer"
    >
      <PlayCircle className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
      {t.watchReviews}
    </button>
  );
}

interface ComparisonButtonProps {
  phones: Phone[];
}

export function WatchComparisonButton({ phones }: ComparisonButtonProps) {
  const { t } = useLanguage();
  if (phones.length < 2) return null;

  const handleClick = () => window.open(buildComparisonUrl(phones), "_blank", "noopener,noreferrer");
  const label = phones.map(p => p.name).join(" vs ");

  return (
    <button
      onClick={handleClick}
      title={`Watch: ${label} review on YouTube`}
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
        border border-border bg-card
        text-muted-foreground text-sm font-semibold
        hover:border-primary/50 hover:text-primary hover:bg-primary/8
        hover:shadow-[0_0_16px_-6px_hsl(var(--primary)/0.4)]
        transition-all duration-300 cursor-pointer"
    >
      <Film className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
      {t.watchComparison}
    </button>
  );
}
