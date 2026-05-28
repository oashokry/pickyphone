import { ImageDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  brand: string;
  name: string;
  variant?: "full" | "compact";
}

function buildWallpaperUrl(brand: string, name: string): string {
  const query = encodeURIComponent(`${brand} ${name}`);
  return `https://www.zedge.net/search/wallpaper/${query}`;
}

export default function WallpaperButton({ brand, name, variant = "full" }: Props) {
  const { t } = useLanguage();
  const url = buildWallpaperUrl(brand, name);

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-card/60 text-muted-foreground text-xs font-semibold hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 w-full"
      >
        <ImageDown className="w-3.5 h-3.5 group-hover:scale-110 transition-transform shrink-0" />
        {t.getWallpapers}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-border bg-card text-muted-foreground font-semibold text-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
    >
      <ImageDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
      {t.getOfficialWallpapers}
    </a>
  );
}
