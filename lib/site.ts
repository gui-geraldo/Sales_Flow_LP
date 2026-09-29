// Endereço oficial e marca, usados em canonical, hreflang, sitemap,
// Open Graph e dados estruturados (JSON-LD).
export const SITE_URL = "https://www.talkerflow.me";
// Talker Flow é a empresa; Sales Flow é o produto. Na página, "Talker Flow"
// só aparece discreto (rodapé, fim do título); o destaque é do produto.
export const PRODUCT = "Sales Flow";
export const ORGANIZATION = "Talker Flow";

// Perfis oficiais (entram no "sameAs" do JSON-LD e no llms.txt).
export const SOCIAL_PROFILES = ["https://www.instagram.com/talkerflow/"];

// Uma URL por IDIOMA pros buscadores e robôs de IA (que visitam quase
// sempre dos EUA e, só pela raiz, veriam a versão em inglês). A moeda não
// gera URL própria: pt+BRL e pt+EUR, ou es+EUR e es+USD, têm o mesmo texto.
// Quem entra pela raiz continua recebendo idioma e moeda do seu país, e
// ?lang= e ?currency= continuam forçando qualquer combinação.
export const LANGS = ["pt", "es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

// "/" → "/?lang=es"; "/whatsapp-crm" → "/whatsapp-crm?lang=es" (páginas futuras).
export function langPath(path: string, lang: Lang) {
  return `${path}?lang=${lang}`;
}

// hreflang de uma página: um link por idioma + x-default (a URL sem
// parâmetro, que escolhe pelo país).
export function langAlternates(path = "/"): Record<string, string> {
  return {
    ...Object.fromEntries(LANGS.map((lang) => [lang, `${SITE_URL}${langPath(path, lang)}`])),
    "x-default": `${SITE_URL}${path}`,
  };
}

// Canonical: a versão de idioma pedida (sem a moeda) ou a URL sem parâmetro.
export function canonicalFor(path: string, query: Record<string, string | string[] | undefined>) {
  const lang = typeof query.lang === "string" ? query.lang.toLowerCase() : null;
  return `${SITE_URL}${isLang(lang) ? langPath(path, lang) : path}`;
}
