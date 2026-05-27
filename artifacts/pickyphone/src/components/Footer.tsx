import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/40 py-8 mt-auto bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        {t.developedBy} <a href="https://forsakenquest.github.io" target="_blank" rel="noopener noreferrer" className="text-primary/80 font-serif italic hover:text-primary transition-colors">Forsaken Quest</a>
      </div>
    </footer>
  );
}
