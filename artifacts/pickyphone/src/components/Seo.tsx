import { useEffect } from "react";

interface MetaProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  image?: string;
  canonical?: string;
  jsonLd?: object | object[];
}

export default function Seo({ title, description, keywords, url, image, canonical, jsonLd }: MetaProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (key: string, content: string, attr: "name" | "property" = "name") => {
      const selector = `meta[${attr}="${key}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let tag = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", image ?? `${url}/og-image.png`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image ?? `${url}/og-image.png`);
    setLink("canonical", canonical ?? url);

    const id = "pickyphone-jsonld";
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, url, image, canonical, jsonLd]);

  return null;
}
