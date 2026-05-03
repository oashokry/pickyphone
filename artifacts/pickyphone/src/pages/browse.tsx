import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { phones } from "@/data/phones";
import PhoneIllustration from "@/components/PhoneIllustration";
import Footer from "@/components/Footer";

const ALL_BRANDS = Array.from(new Set(phones.map(p => p.brand))).sort();

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $500", min: 0, max: 499 },
  { label: "$500 – $800", min: 500, max: 800 },
  { label: "$800 – $1,100", min: 801, max: 1100 },
  { label: "Over $1,100", min: 1101, max: Infinity },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export default function Browse() {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceIdx, setPriceIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const range = PRICE_RANGES[priceIdx];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return phones.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchBrand = !selectedBrand || p.brand === selectedBrand;
      const matchPrice = p.price >= range.min && p.price <= range.max;
      return matchQ && matchBrand && matchPrice;
    });
  }, [query, selectedBrand, priceIdx]);

  const clearFilters = () => {
    setSelectedBrand(null);
    setPriceIdx(0);
    setQuery("");
  };

  const hasFilters = !!query || !!selectedBrand || priceIdx !== 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border/40 px-5 py-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">PickyPhone.</Link>
        <Link href="/compare">
          <button className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/8">
            Compare
          </button>
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Browse</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-1">All Phones</h1>
          <p className="text-muted-foreground text-base">{filtered.length} of {phones.length} devices</p>
        </motion.div>

        {/* Search + filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 space-y-4"
        >
          <div className="flex gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search brand or model…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                filtersOpen || (selectedBrand || priceIdx !== 0)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedBrand || priceIdx !== 0) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {/* Expandable filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-xl border border-border bg-card/60 space-y-5">
                  {/* Brand */}
                  <div>
                    <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Brand</p>
                    <div className="flex flex-wrap gap-2">
                      <ChipBtn active={!selectedBrand} onClick={() => setSelectedBrand(null)}>All</ChipBtn>
                      {ALL_BRANDS.map(b => (
                        <ChipBtn key={b} active={selectedBrand === b} onClick={() => setSelectedBrand(b === selectedBrand ? null : b)}>
                          {b}
                        </ChipBtn>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Price Range</p>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((r, i) => (
                        <ChipBtn key={r.label} active={priceIdx === i} onClick={() => setPriceIdx(i)}>
                          {r.label}
                        </ChipBtn>
                      ))}
                    </div>
                  </div>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-muted-foreground"
          >
            <p className="text-lg font-serif mb-2">No phones found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(phone => (
                <motion.div key={phone.id} variants={cardAnim} layout>
                  <Link href={`/phone/${phone.id}`}>
                    <div className="group bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center
                      cursor-pointer hover:border-primary/35 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]
                      transition-all duration-400 h-full">

                      {/* Illustration */}
                      <div className="w-full h-28 sm:h-36 flex items-center justify-center mb-3 px-3">
                        <PhoneIllustration brand={phone.brand} name={phone.name} />
                      </div>

                      {/* Brand */}
                      <span className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground uppercase mb-1">
                        {phone.brand}
                      </span>

                      {/* Name */}
                      <h3 className="text-sm font-serif font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                        {phone.name}
                      </h3>

                      {/* Colors */}
                      <div className="flex gap-1.5 justify-center mb-3 flex-wrap">
                        {phone.colors.slice(0, 4).map(c => (
                          <div
                            key={c.hex}
                            title={c.name}
                            className="w-2.5 h-2.5 rounded-full border border-white/10"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>

                      {/* Price */}
                      <p className="text-primary font-semibold text-sm mt-auto">
                        ${phone.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{phone.year}</p>

                      {/* Arrow hint on hover */}
                      <div className="mt-2 text-[10px] font-medium text-primary/0 group-hover:text-primary/70 transition-colors">
                        View Details →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ChipBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
        active
          ? "border-primary bg-primary/10 text-primary shadow-[0_0_8px_-2px_hsl(var(--primary)/0.4)]"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
