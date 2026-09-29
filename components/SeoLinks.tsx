import { canonicalFor, langAlternates } from "@/lib/site";

// canonical, og:url e hreflang de uma página com versões por idioma
// (?lang=). Vai como <link>/<meta> na página (o React 19 leva pro <head>)
// e não pelo `alternates` do metadata: o Next descarta a query string de
// URLs com caminho "/" (resolveAbsoluteUrlWithPathname devolve só a origem).
// Reutilizável pras páginas futuras: basta passar o caminho.
export function SeoLinks({
  path = "/",
  query,
}: {
  path?: string;
  query: Record<string, string | string[] | undefined>;
}) {
  const canonical = canonicalFor(path, query);
  return (
    <>
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      {Object.entries(langAlternates(path)).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  );
}
