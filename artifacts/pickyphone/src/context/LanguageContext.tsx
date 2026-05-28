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
  getWallpapers: string;
  getOfficialWallpapers: string;
  upgradeSpeedDesc: string;
  upgradeCamDesc: string;
  upgradeBattDesc: string;
  upgradeDisplayDesc: string;
  upgradeOverallTip: string;
  isItWorthItBtn: string;
  questionOf: (n: number, total: number) => string;
  overallMatch: string;
  retakeQuiz: string;
  worthItSummary: string;
  dependsSummary: string;
  notWorthItSummary: string;
  q1: string; q1Sub: string; q1a: string; q1b: string; q1c: string; q1d: string;
  q2: string; q2Sub: string; q2a: string; q2b: string; q2c: string; q2d: string; q2e: string;
  q3: string; q3Sub: string; q3a: string; q3b: string; q3c: string;
  q4: string; q4Sub: string; q4a: string; q4b: string; q4c: string;
  q5: string; q5Sub: string; q5a: string; q5b: string; q5c: string;
  breakdownBudget: string;
  breakdownUse: string;
  breakdownCamera: string;
  breakdownBattery: string;
  breakdownPerf: string;
  budgetNoteGood: (price: string) => string;
  budgetNoteStretch: (price: string) => string;
  budgetNoteOver: (price: string) => string;
  useGaming2: string; useGaming1: string; useGaming0: string;
  usePhoto2: string; usePhoto1: string; usePhoto0: string;
  useWork2: string; useWork1: string; useWork0: string;
  useCasual2: string; useCasual1: string;
  useMedia2: string; useMedia1: string; useMedia0: string;
  cam2High: (score: number) => string; cam1High: (score: number) => string; cam0High: (score: number) => string;
  cam2Mid: string; cam1Mid: string; cam2Low: string;
  batt2High: (score: number) => string; batt1High: (score: number) => string; batt0High: (score: number) => string;
  batt2Mid: string; batt1Mid: string; batt2Low: string;
  perf2High: (score: number) => string; perf1High: (score: number) => string; perf0High: (score: number) => string;
  perf2Mid: string; perf1Mid: string; perf2Low: string;
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
  getWallpapers: "Get Wallpapers",
  getOfficialWallpapers: "Get Official Wallpapers",
  upgradeSpeedDesc: "Speed, gaming & multitasking",
  upgradeCamDesc: "Photo & video quality",
  upgradeBattDesc: "How long it lasts per charge",
  upgradeDisplayDesc: "Screen sharpness & smoothness",
  upgradeOverallTip: "Average of all four categories — Performance, Camera, Battery, and Display — weighted equally.",
  isItWorthItBtn: "Is it worth it?",
  questionOf: (n, total) => `Question ${n} of ${total}`,
  overallMatch: "Overall match",
  retakeQuiz: "Retake the quiz",
  worthItSummary: "Based on your needs, this phone is a strong match. You'll likely feel the value in daily use.",
  dependsSummary: "There are some clear pros for your use case, but also real trade-offs. Read the breakdown before committing.",
  notWorthItSummary: "Based on your priorities, this phone has too many gaps to justify the price. There are better fits out there.",
  q1: "What's your budget for a new phone?", q1Sub: "We'll check if this phone fits your spending range.",
  q1a: "Under $500", q1b: "$500 – $800", q1c: "$800 – $1,200", q1d: "Over $1,200",
  q2: "How will you mainly use this phone?", q2Sub: "This shapes which specs matter most for you.",
  q2a: "Gaming", q2b: "Photography & Video", q2c: "Work & Productivity", q2d: "Casual everyday use", q2e: "Video streaming & media",
  q3: "How important is camera quality?", q3Sub: "Be honest — do you actually shoot a lot?",
  q3a: "Essential — I shoot photos and videos constantly", q3b: "Nice to have — I use it occasionally", q3c: "Not important — I barely use the camera",
  q4: "How much do you care about battery life?", q4Sub: "Think about your longest days away from a charger.",
  q4a: "Critical — I need it to last all day and more", q4b: "Important — I'd rather not think about it", q4c: "Not a priority — I charge often anyway",
  q5: "What tasks do you run on your phone?", q5Sub: "This tells us how much raw power you actually need.",
  q5a: "Heavy — gaming, video editing, multitasking", q5b: "Everyday — apps, social media, browsing", q5c: "Light — calls, messages, simple apps",
  breakdownBudget: "Budget fit",
  breakdownUse: "Use case match",
  breakdownCamera: "Camera fit",
  breakdownBattery: "Battery fit",
  breakdownPerf: "Performance fit",
  budgetNoteGood: (price) => `${price} fits comfortably within your budget.`,
  budgetNoteStretch: (price) => `${price} is slightly above your budget — a stretch, but close.`,
  budgetNoteOver: (price) => `At ${price}, this is significantly over your budget.`,
  useGaming2: "High performance and display scores — great for gaming.",
  useGaming1: "Decent performance for gaming, but not the fastest option.",
  useGaming0: "Performance and display scores fall short of a gaming-focused pick.",
  usePhoto2: "Elite camera system — ideal for photography and video.",
  usePhoto1: "Solid camera for photography, though pros may want more.",
  usePhoto0: "Camera score is below what dedicated photo users need.",
  useWork2: "Strong performance and battery make it a capable work device.",
  useWork1: "Handles work tasks well, though endurance could be stronger.",
  useWork0: "Not the best match for heavy work and productivity use.",
  useCasual2: "Good value and battery make it a solid casual phone.",
  useCasual1: "Works fine for casual use — possibly more phone than you need.",
  useMedia2: "Excellent screen and battery — perfect for streaming.",
  useMedia1: "Good display for media, battery life could be better.",
  useMedia0: "Display or battery score doesn't suit a media-first lifestyle.",
  cam2High: (score) => `Camera score of ${score}/100 — genuinely excellent for demanding shooters.`,
  cam1High: (score) => `Camera score of ${score}/100 — capable, but not top-tier for heavy photographers.`,
  cam0High: (score) => `Camera score of ${score}/100 — not strong enough if you shoot a lot.`,
  cam2Mid: "Camera is more than good enough for occasional shooting.",
  cam1Mid: "Camera is adequate for casual use.",
  cam2Low: "Camera quality doesn't matter to you, so it won't count against this phone.",
  batt2High: (score) => `Battery score of ${score}/100 — excellent all-day endurance.`,
  batt1High: (score) => `Battery score of ${score}/100 — decent, but power users may want more.`,
  batt0High: (score) => `Battery score of ${score}/100 — not ideal if endurance is critical for you.`,
  batt2Mid: "Battery is solid enough that you won't have to think about it.",
  batt1Mid: "Battery is passable — you may need to top up on long days.",
  batt2Low: "Since battery life isn't a priority, this won't affect your verdict.",
  perf2High: (score) => `Performance score of ${score}/100 — built for demanding tasks.`,
  perf1High: (score) => `Performance score of ${score}/100 — capable, but heavy users may notice limits.`,
  perf0High: (score) => `Performance score of ${score}/100 — not suited for heavy use.`,
  perf2Mid: "More than powerful enough for everyday apps and browsing.",
  perf1Mid: "Handles everyday tasks, though it's not the snappiest.",
  perf2Low: "Any modern smartphone handles light tasks — this one is no exception.",
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
  getWallpapers: "احصل على خلفيات",
  getOfficialWallpapers: "احصل على الخلفيات الرسمية",
  upgradeSpeedDesc: "السرعة والألعاب وتعدد المهام",
  upgradeCamDesc: "جودة الصور والفيديو",
  upgradeBattDesc: "مدة الشحنة الواحدة",
  upgradeDisplayDesc: "حدة الشاشة وسلاسة الحركة",
  upgradeOverallTip: "متوسط الأربع فئات — الأداء والكاميرا والبطارية والشاشة — بأوزان متساوية.",
  isItWorthItBtn: "هل يستحق؟",
  questionOf: (n, total) => `السؤال ${n} من ${total}`,
  overallMatch: "التطابق الإجمالي",
  retakeQuiz: "إعادة الاختبار",
  worthItSummary: "بناءً على احتياجاتك، هذا الهاتف خيار قوي. ستشعر بقيمته في الاستخدام اليومي.",
  dependsSummary: "هناك مزايا واضحة لحالة استخدامك، لكن هناك أيضاً تنازلات حقيقية. اقرأ التفاصيل قبل اتخاذ قرارك.",
  notWorthItSummary: "بناءً على أولوياتك، هذا الهاتف لا يبرر سعره. هناك خيارات أفضل لك.",
  q1: "ما ميزانيتك لشراء هاتف جديد؟", q1Sub: "سنتحقق ما إذا كان هذا الهاتف يناسب ميزانيتك.",
  q1a: "أقل من 500$", q1b: "500$ – 800$", q1c: "800$ – 1,200$", q1d: "أكثر من 1,200$",
  q2: "كيف ستستخدم هذا الهاتف بشكل رئيسي؟", q2Sub: "هذا يحدد أي المواصفات تهمك أكثر.",
  q2a: "الألعاب", q2b: "التصوير الفوتوغرافي والفيديو", q2c: "العمل والإنتاجية", q2d: "الاستخدام اليومي العادي", q2e: "بث الفيديو والوسائط",
  q3: "ما مدى أهمية جودة الكاميرا بالنسبة لك؟", q3Sub: "كن صادقاً — هل تلتقط الصور كثيراً؟",
  q3a: "ضرورية — أصوّر باستمرار", q3b: "جيدة أن تكون — أستخدمها أحياناً", q3c: "غير مهمة — بالكاد أستخدم الكاميرا",
  q4: "ما مدى اهتمامك بعمر البطارية؟", q4Sub: "فكّر في أطول أيامك بعيداً عن الشاحن.",
  q4a: "أساسي — أحتاجها طوال اليوم وأكثر", q4b: "مهم — أفضل ألا أفكر فيها", q4c: "ليست أولوية — أشحن بانتظام",
  q5: "ما نوع المهام التي تشغّلها على هاتفك؟", q5Sub: "هذا يخبرنا بمقدار القوة الفعلية التي تحتاجها.",
  q5a: "ثقيلة — ألعاب وتحرير فيديو وتعدد مهام", q5b: "يومية — تطبيقات وتواصل اجتماعي وتصفح", q5c: "خفيفة — مكالمات ورسائل وتطبيقات بسيطة",
  breakdownBudget: "ملاءمة الميزانية",
  breakdownUse: "تطابق حالة الاستخدام",
  breakdownCamera: "ملاءمة الكاميرا",
  breakdownBattery: "ملاءمة البطارية",
  breakdownPerf: "ملاءمة الأداء",
  budgetNoteGood: (price) => `${price} يناسب ميزانيتك بشكل مريح.`,
  budgetNoteStretch: (price) => `${price} أعلى قليلاً من ميزانيتك — يمكن الوصول إليه لكنه مجهد.`,
  budgetNoteOver: (price) => `بسعر ${price}، هذا الهاتف يتجاوز ميزانيتك بشكل ملحوظ.`,
  useGaming2: "درجات أداء وشاشة عالية — رائع للألعاب.",
  useGaming1: "أداء مقبول للألعاب، لكنه ليس الأسرع.",
  useGaming0: "درجات الأداء والشاشة لا تصل لمستوى هواتف الألعاب.",
  usePhoto2: "نظام كاميرا متميز — مثالي للتصوير والفيديو.",
  usePhoto1: "كاميرا جيدة للتصوير، رغم أن المحترفين قد يريدون المزيد.",
  usePhoto0: "تقييم الكاميرا أقل مما يحتاجه المصورون المتخصصون.",
  useWork2: "أداء وبطارية قويان يجعلانه جهاز عمل ممتاز.",
  useWork1: "يتعامل مع مهام العمل جيداً، رغم أن الاستمرارية قد تكون أفضل.",
  useWork0: "ليس الخيار الأمثل للعمل المكثف والإنتاجية.",
  useCasual2: "قيمة جيدة وبطارية تجعله هاتفاً يومياً ممتازاً.",
  useCasual1: "يعمل بشكل جيد للاستخدام اليومي — ربما أكثر مما تحتاج.",
  useMedia2: "شاشة وبطارية ممتازتان — مثالي للبث.",
  useMedia1: "شاشة جيدة للوسائط، عمر البطارية يمكن أن يكون أفضل.",
  useMedia0: "تقييم الشاشة أو البطارية لا يناسب أسلوب الحياة الإعلامي.",
  cam2High: (score) => `تقييم الكاميرا ${score}/100 — ممتاز حقاً للمصورين المتطلبين.`,
  cam1High: (score) => `تقييم الكاميرا ${score}/100 — جيد، لكن ليس الأفضل للمصورين المحترفين.`,
  cam0High: (score) => `تقييم الكاميرا ${score}/100 — ليس قوياً بما يكفي إذا كنت تصوّر كثيراً.`,
  cam2Mid: "الكاميرا أكثر من كافية للتصوير العرضي.",
  cam1Mid: "الكاميرا مناسبة للاستخدام اليومي.",
  cam2Low: "جودة الكاميرا لا تهمك، لذا لن تؤثر على الحكم.",
  batt2High: (score) => `تقييم البطارية ${score}/100 — استمرارية رائعة طوال اليوم.`,
  batt1High: (score) => `تقييم البطارية ${score}/100 — مقبول، لكن مستخدمو الطاقة قد يريدون المزيد.`,
  batt0High: (score) => `تقييم البطارية ${score}/100 — غير مثالي إذا كانت الاستمرارية أساسية لك.`,
  batt2Mid: "البطارية قوية بما يكفي حتى لا تضطر للتفكير فيها.",
  batt1Mid: "البطارية مقبولة — قد تحتاج للشحن في الأيام الطويلة.",
  batt2Low: "بما أن عمر البطارية ليس أولوية، لن يؤثر هذا على الحكم.",
  perf2High: (score) => `تقييم الأداء ${score}/100 — مصمم للمهام الصعبة.`,
  perf1High: (score) => `تقييم الأداء ${score}/100 — قادر، لكن المستخدمون المكثفون قد يلاحظون القيود.`,
  perf0High: (score) => `تقييم الأداء ${score}/100 — غير مناسب للاستخدام المكثف.`,
  perf2Mid: "أقوى من اللازم لتطبيقات التصفح اليومية.",
  perf1Mid: "يتعامل مع المهام اليومية، رغم أنه ليس الأسرع.",
  perf2Low: "أي هاتف ذكي حديث يتعامل مع المهام الخفيفة — وهذا ليس استثناءً.",
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
