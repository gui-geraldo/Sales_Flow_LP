import { SITE_URL, canonicalFor, langAlternates, type Lang } from "@/lib/site";

// canonical, og:url e hreflang de uma página com versões por idioma
// (?lang=). Vai como <link>/<meta> na página (o React 19 leva pro <head>)
// e não pelo `alternates` do metadata: o Next descarta a query string de
// URLs com caminho "/" (resolveAbsoluteUrlWithPathname devolve só a origem).
// Reutilizável pras páginas futuras: basta passar o caminho.
//
// `onlyLang`: página que só existe num idioma (ex.: /crm-whatsapp, só es).
// Canonical é a URL sem parâmetro, com hreflang desse idioma + x-default.
export function SeoLinks({
  path = "/",
  query = {},
  onlyLang,
}: {
  path?: string;
  query?: Record<string, string | string[] | undefined>;
  onlyLang?: Lang;
}) {
  const canonical = onlyLang ? `${SITE_URL}${path}` : canonicalFor(path, query);
  const alternates = onlyLang ? { [onlyLang]: canonical, "x-default": canonical } : langAlternates(path);
  return (
    <>
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      {Object.entries(alternates).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  );
}
