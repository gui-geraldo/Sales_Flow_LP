import type { MetadataRoute } from "next";
import { LEGAL_UPDATED_AT } from "@/lib/legal";
import { SITE_URL, VARIANTS, homeAlternates, variantPath } from "@/lib/site";

// O Next não escapa as URLs no XML do sitemap; o "&" de ?lang=..&currency=..
// precisa virar "&amp;", senão o arquivo fica inválido.
const xml = (url: string) => url.replace(/&/g, "&amp;");

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(Object.entries(homeAlternates()).map(([k, v]) => [k, xml(v)]));
  const home = [
    { url: `${SITE_URL}/`, priority: 1 },
    ...VARIANTS.map((v) => ({ url: xml(`${SITE_URL}${variantPath(v.lang, v.currency)}`), priority: 0.9 })),
  ].map((entry) => ({
    ...entry,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    alternates: { languages },
  }));

  const legal = ["/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${LEGAL_UPDATED_AT}T12:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...home, ...legal];
}
