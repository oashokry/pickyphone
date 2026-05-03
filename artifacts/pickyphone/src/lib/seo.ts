import { phones, type Phone } from "@/data/phones";

const SITE_NAME = "PickyPhone";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://pickyphone.com";

export function getCanonicalUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function phonePath(phoneId: string) {
  return `/phones/${phoneId}`;
}

export function comparePath(left: string, right: string) {
  return `/compare/${left}-vs-${right}`;
}

export function phoneTitle(phone: Phone) {
  return `${phone.name} Specs, Price & Review | ${SITE_NAME}`;
}

export function phoneDescription(phone: Phone) {
  return `Full specs, price, and detailed analysis of ${phone.name}. Compare and find out if it's worth it.`;
}

export function phoneKeywords(phone: Phone) {
  return [phone.name, phone.brand, `${phone.brand} ${phone.name} specs`, `${phone.brand} ${phone.name} price`, `${phone.brand} ${phone.name} review`, "smartphone comparison", "phone specs", "is it worth it"].join(", ");
}

export function phoneImage(phone: Phone) {
  return phone.imageUrl;
}

export function compareTitle(left: Phone, right: Phone) {
  return `${left.name} vs ${right.name} Comparison | ${SITE_NAME}`;
}

export function compareDescription(left: Phone, right: Phone) {
  return `Compare ${left.name} and ${right.name} side by side with specs, prices, and smart recommendations.`;
}

export function compareKeywords(left: Phone, right: Phone) {
  return [`${left.name} vs ${right.name}`, `${left.brand} ${left.name} vs ${right.brand} ${right.name}`, "phone comparison", "smartphone specs", "best phone comparison"].join(", ");
}

export function homeTitle() {
  return `PickyPhone | Premium Smartphone Comparison`;
}

export function homeDescription() {
  return "Compare the world's best smartphones with premium specs, smart recommendations, and luxury black-and-gold design.";
}

export function homeKeywords() {
  return "smartphone comparison, phone specs, compare phones, best phones 2026, premium phone comparison";
}

export function browseTitle() {
  return `Browse Phones | ${SITE_NAME}`;
}

export function browseDescription() {
  return "Browse all phones in the PickyPhone database with search and filters to find the best smartphone for you.";
}

export function browseKeywords() {
  return "browse phones, smartphone catalog, phone search, compare phones, phone prices";
}

export function analyzeTitle(phone: Phone) {
  return `Is ${phone.name} Worth It? | ${SITE_NAME}`;
}

export function analyzeDescription(phone: Phone) {
  return `Analyze whether ${phone.name} is worth it for your budget, usage, and priorities with a quick personalized phone verdict.`;
}

export function analyzeKeywords(phone: Phone) {
  return `${phone.name}, is it worth it, phone analysis, phone value, smartphone recommendation`;
}

export function buildPhoneSchema(phone: Phone) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: phone.name,
    brand: { "@type": "Brand", name: phone.brand },
    image: [phone.imageUrl],
    description: phoneDescription(phone),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: phone.price,
      availability: "https://schema.org/InStock",
      url: getCanonicalUrl(phonePath(phone.id)),
    },
  };
}

export function buildSitemapUrls() {
  const urls = ["/", "/compare", "/preferences", "/results", "/browse"];
  for (const phone of phones) urls.push(phonePath(phone.id));
  for (let i = 0; i < phones.length - 1; i++) urls.push(comparePath(phones[i].id, phones[i + 1].id));
  return urls;
}

export function buildBreadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.href),
    })),
  };
}
