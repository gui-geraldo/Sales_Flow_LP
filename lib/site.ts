// Endereço oficial e marca, usados em canonical, hreflang, sitemap,
// Open Graph e dados estruturados (JSON-LD).
export const SITE_URL = "https://www.talkerflow.me";
export const BRAND = "Sales Flow by Talker Flow";

// Uma URL por idioma e moeda, pros buscadores e robôs de IA (que visitam
// quase sempre dos EUA e sem os parâmetros só veriam a versão em inglês).
// Quem entra pela raiz continua recebendo o idioma e a moeda do seu país.
export const VARIANTS = [
  { hreflang: "pt-BR", lang: "pt", currency: "brl" },
  { hreflang: "pt-PT", lang: "pt", currency: "eur" },
  { hreflang: "es-ES", lang: "es", currency: "eur" },
  { hreflang: "es", lang: "es", currency: "usd" },
  { hreflang: "en", lang: "en", currency: "usd" },
] as const;

export function variantPath(lang: string, currency: string) {
  return `/?lang=${lang}&currency=${currency}`;
}

// hreflang da página inicial: as variantes + x-default (a raiz, que escolhe pelo país).
export function homeAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(VARIANTS.map((v) => [v.hreflang, `${SITE_URL}${variantPath(v.lang, v.currency)}`])),
    "x-default": `${SITE_URL}/`,
  };
}
