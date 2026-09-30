import type { MetadataRoute } from "next";
import { LEGAL_UPDATED_AT } from "@/lib/legal";
import { LANGS, SITE_URL, SPANISH_ONLY_PAGES, langAlternates, langPath } from "@/lib/site";

// Só as URLs que queremos indexadas: a raiz (x-default), uma por idioma e
// as páginas legais. Combinações de moeda não entram: o texto é o mesmo.

// O Next não escapa as URLs no XML do sitemap; se uma URL tiver "&" um dia,
// ele precisa virar "&amp;", senão o arquivo fica inválido.
const xml = (url: string) => url.replace(/&/g, "&amp;");

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(Object.entries(langAlternates("/")).map(([k, v]) => [k, xml(v)]));
  const home = [
    { url: `${SITE_URL}/`, priority: 1 },
    ...LANGS.map((lang) => ({ url: xml(`${SITE_URL}${langPath("/", lang)}`), priority: 0.9 })),
  ].map((entry) => ({
    ...entry,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    alternates: { languages },
  }));

  // Páginas de busca só em espanhol: uma URL, hreflang es + x-default.
  const spanishOnly = SPANISH_ONLY_PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: { languages: { es: `${SITE_URL}${path}`, "x-default": `${SITE_URL}${path}` } },
  }));

  const legal = ["/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${LEGAL_UPDATED_AT}T12:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...home, ...spanishOnly, ...legal];
}
