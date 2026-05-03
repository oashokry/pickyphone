import { phones } from "@/data/phones";
import { buildSitemapUrls } from "@/lib/seo";

export function Sitemap() {
  const urls = buildSitemapUrls();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>https://pickyphone.com${url}</loc></url>`).join("\n")}
</urlset>`;
}

export function Robots() {
  return `User-agent: *
Allow: /
Sitemap: https://pickyphone.com/sitemap.xml
`;
}

export function phoneIndexData() {
  return phones.map(phone => ({ id: phone.id, name: phone.name }));
}
