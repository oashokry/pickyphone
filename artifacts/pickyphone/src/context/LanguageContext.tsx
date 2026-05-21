import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar";

export interface Translations {
  back: string;
  share: string;
  copied: string;
  lang: string;
  compare: string;
  browse: string;
  homeTagline: string;
  homeDesc: string;
  startComparing: string;
  browsePhones: string;
  featureUnbiasedTitle: string;
  featureUnbiasedDesc: string;
  featureSideBySideTitle: string;
  featureSideBySideDesc: string;
  featureSmartVerdictsTitle: string;
  featureSmartVerdictsDesc: string;
  featureBrowseAnalyzeTitle: string;
  featureBrowseAnalyzeDesc: string;
  browseLabel: string;
  allPhones: string;
  devicesCount: (n: number, total: number) => string;
  searchPlaceholder: string;
  filters: string;
  clearAllFilters: string;
  brand: string;
  all: string;
  priceRange: string;
  allPrices: string;
  under500: string;
  price500to800: string;
  price800to1100: string;
  over1100: string;
  noPhonesFound: string;
  tryAdjusting: string;
  viewDetails: string;
  compareLabel: string;
  buildYourComparison: string;
  pickDevices: string;
  howManyPhones: string;
  phonesCount: (n: number) => string;
  selectDevices: string;
  phoneN: (n: number) => string;
  searchBrandModel: string;
  quickPriority: string;
  quickPrioritySub: string;
  skipCompareOnly: string;
  personaliseCompare: string;
  camera: string;
  performance: string;
  battery: string;
  display: string;
  price: string;
  balanced: string;
  personalise: string;
  whatMatters: string;
  tellUsPriorities: string;
  budgetRange: string;
  min: string;
  max: string;
  usageType: string;
  gaming: string;
  gamingDesc: string;
  casual: string;
  casualDesc: string;
  work: string;
  workDesc: string;
  photography: string;
  photographyDesc: string;
  mixed: string;
  mixedDesc: string;
  topPriority: string;
  yourCurrentPhone: string;
  currentPhoneOptional: string;
  currentPhoneDesc: string;
  searchCurrentPhone: string;
  clearSelection: string;
  seeMyResults: string;
  worthIt: string;
  notWorthIt: string;
  plainEnglishSummary: string;
  detailedComparison: string;
  translatingSpecs: string;
  couldntGenerate: string;
  plainEnglish: string;
  isItWorthUpgrading: string;
  comparingFrom: string;
  overall: string;
  marginal: string;
  bestForYou: string;
  match: string;
  perfectMatch: string;
  greatMatch: string;
  goodMatch: string;
  fullSpecifications: string;
  translateToHuman: string;
  screenSize: string;
  resolution: string;
  panelType: string;
  refreshRate: string;
  displayScore: string;
  chipset: string;
  ram: string;
  storage: string;
  performanceScore: string;
  mainCamera: string;
  ultrawide: string;
  telephoto: string;
  video: string;
  cameraScore: string;
  capacity: string;
  charging: string;
  batteryScore: string;
  connectivityOther: string;
  colorsAvailable: string;
  releaseYear: string;
  youMightAlsoLike: string;
  similarPhones: string;
  browseAll: string;
  phoneNotFound: string;
  backToBrowse: string;
  qualityScore: string;
  powerScore: string;
  opticsScore: string;
  enduranceScore: string;
  specSize: string;
  specType: string;
  specRam: string;
  specMain: string;
  specUltrawide: string;
  specTelephoto: string;
  specVideo: string;
  specCapacity: string;
  specCharging: string;
  specOptions: string;
  isItWorthIt: string;
  worthItVerdict: string;
  dependsVerdict: string;
  notWorthItVerdict: string;
  budgetLabel: string;
  usageLabel: string;
  priorityLabel: string;
  budgetUnder500: string;
  budgetMid: string;
  budgetPremium: string;
  budgetFlagship: string;
  usagePhotoDesc: string;
  usageGamingDesc: string;
  usageWorkDesc: string;
  usageCasualDesc: string;
  usageMixedDesc: string;
  priorityPriceValue: string;
  mixedUseLabel: string;
  watchReviews: string;
  watchComparison: string;
  bestChoice: string;
  developedBy: string;
  selectPhone: string;
  searchBrandModelPlaceholder: string;
  noPhoneFound: string;
}

const en: Translations = {
  back: "Back",
  share: "Share",
  copied: "Copied!",
  lang: "العربية",
  compare: "Compare",
  browse: "Browse",
  homeTagline: "The Smart Choice",
  homeDesc: "Compare the world's best smartphones side by side. Find your perfect match in under two minutes.",
  startComparing: "Start Comparing",
  browsePhones: "Browse Phones",
  featureUnbiasedTitle: "Unbiased Data",
  featureUnbiasedDesc: "Raw specs, real-world scores, and 2026 market prices across 50+ flagship devices.",
  featureSideBySideTitle: "Side-by-Side",
  featureSideBySideDesc: "Compare up to four phones at once with our dense, gold-highlighted spec grid.",
  featureSmartVerdictsTitle: "Smart Verdicts",
  featureSmartVerdictsDesc: "Tell us what matters—camera, battery, price—and we'll declare a clear winner.",
  featureBrowseAnalyzeTitle: "Browse & Analyze",
  featureBrowseAnalyzeDesc: 'Explore all 50+ phones and get a personalized "Is It Worth It?" verdict for any device.',
  browseLabel: "Browse",
  allPhones: "All Phones",
  devicesCount: (n, total) => `${n} of ${total} devices`,
  searchPlaceholder: "Search brand or model…",
  filters: "Filters",
  clearAllFilters: "Clear all filters",
  brand: "Brand",
  all: "All",
  priceRange: "Price Range",
  allPrices: "All Prices",
  under500: "Under $500",
  price500to800: "$500 – $800",
  price800to1100: "$800 – $1,100",
  over1100: "Over $1,100",
  noPhonesFound: "No phones found",
  tryAdjusting: "Try adjusting your search or filters.",
  viewDetails: "View Details →",
  compareLabel: "Compare",
  buildYourComparison: "Build Your Comparison",
  pickDevices: "Pick your devices and what you care about most.",
  howManyPhones: "How many phones?",
  phonesCount: (n) => `${n} Phones`,
  selectDevices: "Select Devices",
  phoneN: (n) => `Phone ${n}`,
  searchBrandModel: "Search brand or model...",
  quickPriority: "Quick Priority",
  quickPrioritySub: "(optional — for direct compare)",
  skipCompareOnly: "Skip — Compare Only",
  personaliseCompare: "Personalise & Compare",
  camera: "Camera",
  performance: "Performance",
  battery: "Battery",
  display: "Display",
  price: "Price",
  balanced: "Balanced",
  personalise: "Personalise",
  whatMatters: "What matters to you?",
  tellUsPriorities: "Tell us your priorities and we'll score each phone for you.",
  budgetRange: "Budget Range",
  min: "Min",
  max: "Max",
  usageType: "Usage Type",
  gaming: "Gaming",
  gamingDesc: "High refresh rate & top performance",
  casual: "Casual",
  casualDesc: "Battery & everyday reliability",
  work: "Work",
  workDesc: "Multitasking & all-day power",
  photography: "Photography",
  photographyDesc: "Camera quality above all",
  mixed: "Mixed",
  mixedDesc: "Balanced across everything",
  topPriority: "Top Priority",
  yourCurrentPhone: "Your Current Phone",
  currentPhoneOptional: "Optional — unlocks upgrade analysis",
  currentPhoneDesc: "Select your current device and we'll calculate exactly how much each phone improves on Performance, Camera, Battery, and Display — with a clear Worth It or Not Worth It verdict.",
  searchCurrentPhone: "Search your current phone...",
  clearSelection: "Clear selection",
  seeMyResults: "See My Results",
  worthIt: "Worth It",
  notWorthIt: "Not Worth It",
  plainEnglishSummary: "Plain English Summary",
  detailedComparison: "Detailed Comparison",
  translatingSpecs: "Translating specs into plain English…",
  couldntGenerate: "Couldn't generate comparison right now. Try again.",
  plainEnglish: "Plain English",
  isItWorthUpgrading: "Is It Worth Upgrading?",
  comparingFrom: "Comparing from",
  overall: "Overall",
  marginal: "Marginal",
  bestForYou: "Best For You",
  match: "match",
  perfectMatch: "Perfect Match",
  greatMatch: "Great Match",
  goodMatch: "Good Match",
  fullSpecifications: "Full Specifications",
  translateToHuman: "Translate to Human Language",
  screenSize: "Screen Size",
  resolution: "Resolution",
  panelType: "Panel Type",
  refreshRate: "Refresh Rate",
  displayScore: "Display Score",
  chipset: "Chipset",
  ram: "RAM",
  storage: "Storage",
  performanceScore: "Performance Score",
  mainCamera: "Main Camera",
  ultrawide: "Ultrawide",
  telephoto: "Telephoto",
  video: "Video",
  cameraScore: "Camera Score",
  capacity: "Capacity",
  charging: "Charging",
  batteryScore: "Battery Score",
  connectivityOther: "Connectivity & Other",
  colorsAvailable: "Colors Available",
  releaseYear: "Release Year",
  youMightAlsoLike: "You Might Also Like",
  similarPhones: "Similar Phones",
  browseAll: "Browse all →",
  phoneNotFound: "Phone not found.",
  backToBrowse: "← Back to Browse",
  qualityScore: "Quality Score",
  powerScore: "Power Score",
  opticsScore: "Optics Score",
  enduranceScore: "Endurance Score",
  specSize: "Size",
  specType: "Type",
  specRam: "RAM",
  specMain: "Main",
  specUltrawide: "Ultrawide",
  specTelephoto: "Telephoto",
  specVideo: "Video",
  specCapacity: "Capacity",
  specCharging: "Charging",
  specOptions: "Options",
  isItWorthIt: "Is It Worth It?",
  worthItVerdict: "Worth It",
  dependsVerdict: "Depends",
  notWorthItVerdict: "Not Worth It",
  budgetLabel: "Budget",
  usageLabel: "Usage",
  priorityLabel: "Priority",
  budgetUnder500: "Budget  (< $500)",
  budgetMid: "Mid-range ($500–$800)",
  budgetPremium: "Premium ($800–$1,100)",
  budgetFlagship: "Flagship (> $1,100)",
  usagePhotoDesc: "Shooting photos & videos",
  usageGamingDesc: "Mobile games & performance",
  usageWorkDesc: "Productivity & multitasking",
  usageCasualDesc: "Everyday browsing & social",
  usageMixedDesc: "A bit of everything",
  priorityPriceValue: "Price / Value",
  mixedUseLabel: "Mixed Use",
  watchReviews: "Watch Reviews",
  watchComparison: "Watch Comparison",
  bestChoice: "Best Choice",
  developedBy: "Developed by",
  selectPhone: "Select phone...",
  searchBrandModelPlaceholder: "Search brand or model...",
  noPhoneFound: "No phone found.",
};

const ar: Translations = {
  back: "رجوع",
  share: "مشاركة",
  copied: "تم النسخ!",
  lang: "English",
  compare: "مقارنة",
  browse: "تصفح",
  homeTagline: "الاختيار الذكي",
  homeDesc: "قارن أفضل الهواتف الذكية في العالم جنبًا إلى جنب. اعثر على هاتفك المثالي في أقل من دقيقتين.",
  startComparing: "ابدأ المقارنة",
  browsePhones: "تصفح الهواتف",
  featureUnbiasedTitle: "بيانات محايدة",
  featureUnbiasedDesc: "مواصفات حقيقية وتقييمات واقعية وأسعار السوق لأكثر من 50 هاتفًا رائدًا.",
  featureSideBySideTitle: "مقارنة جنبًا إلى جنب",
  featureSideBySideDesc: "قارن حتى أربعة هواتف في وقت واحد بشبكة المواصفات المفصلة.",
  featureSmartVerdictsTitle: "أحكام ذكية",
  featureSmartVerdictsDesc: "أخبرنا بما يهمك — الكاميرا أو البطارية أو السعر — وسنعلن الفائز.",
  featureBrowseAnalyzeTitle: "تصفح وتحليل",
  featureBrowseAnalyzeDesc: 'استكشف أكثر من 50 هاتفًا واحصل على تقييم شخصي "هل يستحق؟" لأي جهاز.',
  browseLabel: "تصفح",
  allPhones: "جميع الهواتف",
  devicesCount: (n, total) => `${n} من ${total} جهاز`,
  searchPlaceholder: "ابحث عن الماركة أو الطراز...",
  filters: "تصفية",
  clearAllFilters: "مسح كل الفلاتر",
  brand: "الماركة",
  all: "الكل",
  priceRange: "نطاق السعر",
  allPrices: "جميع الأسعار",
  under500: "أقل من 500$",
  price500to800: "500$ – 800$",
  price800to1100: "800$ – 1,100$",
  over1100: "أكثر من 1,100$",
  noPhonesFound: "لا توجد هواتف",
  tryAdjusting: "حاول تعديل البحث أو الفلاتر.",
  viewDetails: "عرض التفاصيل ←",
  compareLabel: "مقارنة",
  buildYourComparison: "أنشئ مقارنتك",
  pickDevices: "اختر أجهزتك وما يهمك أكثر.",
  howManyPhones: "كم عدد الهواتف؟",
  phonesCount: (n) => `${n} هواتف`,
  selectDevices: "اختر الأجهزة",
  phoneN: (n) => `هاتف ${n}`,
  searchBrandModel: "ابحث عن الماركة أو الطراز...",
  quickPriority: "الأولوية السريعة",
  quickPrioritySub: "(اختياري — للمقارنة المباشرة)",
  skipCompareOnly: "تخطي — مقارنة فقط",
  personaliseCompare: "تخصيص ومقارنة",
  camera: "الكاميرا",
  performance: "الأداء",
  battery: "البطارية",
  display: "الشاشة",
  price: "السعر",
  balanced: "متوازن",
  personalise: "تخصيص",
  whatMatters: "ما الذي يهمك؟",
  tellUsPriorities: "أخبرنا بأولوياتك وسنقيّم كل هاتف لك.",
  budgetRange: "نطاق الميزانية",
  min: "الحد الأدنى",
  max: "الحد الأقصى",
  usageType: "نوع الاستخدام",
  gaming: "الألعاب",
  gamingDesc: "معدل تحديث عالٍ وأداء متميز",
  casual: "الاستخدام اليومي",
  casualDesc: "بطارية وموثوقية يومية",
  work: "العمل",
  workDesc: "تعدد المهام وطاقة طوال اليوم",
  photography: "التصوير",
  photographyDesc: "جودة الكاميرا فوق كل شيء",
  mixed: "متعدد",
  mixedDesc: "توازن في كل شيء",
  topPriority: "الأولوية الأولى",
  yourCurrentPhone: "هاتفك الحالي",
  currentPhoneOptional: "اختياري — يفتح تحليل الترقية",
  currentPhoneDesc: "اختر جهازك الحالي وسنحسب بدقة مقدار التحسن في الأداء والكاميرا والبطارية والشاشة — مع حكم واضح «يستحق» أو «لا يستحق».",
  searchCurrentPhone: "ابحث عن هاتفك الحالي...",
  clearSelection: "مسح الاختيار",
  seeMyResults: "اعرض نتائجي",
  worthIt: "يستحق",
  notWorthIt: "لا يستحق",
  plainEnglishSummary: "ملخص مبسط",
  detailedComparison: "مقارنة مفصلة",
  translatingSpecs: "جارٍ تبسيط المواصفات...",
  couldntGenerate: "تعذّر إنشاء المقارنة الآن. حاول مرة أخرى.",
  plainEnglish: "ملخص مبسط",
  isItWorthUpgrading: "هل يستحق الترقية؟",
  comparingFrom: "المقارنة من",
  overall: "الإجمالي",
  marginal: "هامشي",
  bestForYou: "الأفضل لك",
  match: "تطابق",
  perfectMatch: "تطابق مثالي",
  greatMatch: "تطابق رائع",
  goodMatch: "تطابق جيد",
  fullSpecifications: "المواصفات الكاملة",
  translateToHuman: "ترجمة إلى لغة بسيطة",
  screenSize: "حجم الشاشة",
  resolution: "الدقة",
  panelType: "نوع الشاشة",
  refreshRate: "معدل التحديث",
  displayScore: "تقييم الشاشة",
  chipset: "المعالج",
  ram: "الذاكرة العشوائية",
  storage: "التخزين",
  performanceScore: "تقييم الأداء",
  mainCamera: "الكاميرا الرئيسية",
  ultrawide: "فائقة الاتساع",
  telephoto: "التكبير",
  video: "الفيديو",
  cameraScore: "تقييم الكاميرا",
  capacity: "السعة",
  charging: "الشحن",
  batteryScore: "تقييم البطارية",
  connectivityOther: "الاتصالية وغيرها",
  colorsAvailable: "الألوان المتاحة",
  releaseYear: "سنة الإصدار",
  youMightAlsoLike: "قد يعجبك أيضًا",
  similarPhones: "هواتف مشابهة",
  browseAll: "تصفح الكل ←",
  phoneNotFound: "الهاتف غير موجود.",
  backToBrowse: "العودة إلى التصفح ←",
  qualityScore: "تقييم الجودة",
  powerScore: "تقييم الأداء",
  opticsScore: "تقييم الكاميرا",
  enduranceScore: "تقييم الاستمرارية",
  specSize: "الحجم",
  specType: "النوع",
  specRam: "الذاكرة",
  specMain: "الرئيسية",
  specUltrawide: "فائقة الاتساع",
  specTelephoto: "التكبير",
  specVideo: "الفيديو",
  specCapacity: "السعة",
  specCharging: "الشحن",
  specOptions: "الخيارات",
  isItWorthIt: "هل يستحق؟",
  worthItVerdict: "يستحق",
  dependsVerdict: "يعتمد",
  notWorthItVerdict: "لا يستحق",
  budgetLabel: "الميزانية",
  usageLabel: "الاستخدام",
  priorityLabel: "الأولوية",
  budgetUnder500: "اقتصادي (أقل من 500$)",
  budgetMid: "متوسط (500$–800$)",
  budgetPremium: "مميز (800$–1,100$)",
  budgetFlagship: "رائد (أكثر من 1,100$)",
  usagePhotoDesc: "التقاط الصور ومقاطع الفيديو",
  usageGamingDesc: "الألعاب على الجوال والأداء",
  usageWorkDesc: "الإنتاجية وتعدد المهام",
  usageCasualDesc: "التصفح اليومي والتواصل الاجتماعي",
  usageMixedDesc: "قليل من كل شيء",
  priorityPriceValue: "السعر / القيمة",
  mixedUseLabel: "متعدد الاستخدام",
  watchReviews: "مشاهدة المراجعات",
  watchComparison: "مشاهدة المقارنة",
  bestChoice: "الخيار الأفضل",
  developedBy: "طوّره",
  selectPhone: "اختر هاتفًا...",
  searchBrandModelPlaceholder: "ابحث عن الماركة أو الطراز...",
  noPhoneFound: "لا يوجد هاتف.",
};

const DICT: Record<Lang, Translations> = { en, ar };

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: en,
  toggleLang: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("pp_lang") as Lang) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    try { localStorage.setItem("pp_lang", lang); } catch {}
  }, [lang]);

  const toggleLang = () => setLang(l => (l === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t: DICT[lang], toggleLang, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, toggleLang, lang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/60 text-muted-foreground text-xs font-semibold hover:border-primary/50 hover:text-primary hover:bg-primary/8 transition-all duration-300 ${className}`}
    >
      <span className="text-base leading-none">{lang === "ar" ? "🇬🇧" : "🇸🇦"}</span>
      {t.lang}
    </button>
  );
}
