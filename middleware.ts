import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { CURRENCY_HEADER } from "./lib/pricing";
import { isSpanishOnlyPath } from "./lib/site";

const VALID_CURRENCIES = new Set(["BRL", "EUR", "USD"]);
const VALID_LOCALES = new Set<string>(routing.locales);

// América Latina de língua espanhola (Espanha fica de fora, tratada à parte).
const SPANISH_LATAM = new Set([
  "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);

// Idioma e moeda saem do país da visita, a cada requisição, e a URL fica
// sempre na raiz (sem /es). Só ?lang= e ?currency= na própria URL forçam
// outra combinação (ex.: /?lang=es&currency=eur); sem eles, volta ao país.
type Resolved = { locale: string; currency: string };

// Regras de negócio (confirmadas com o usuário):
// Brasil → pt + BRL · Espanha → es + EUR · Portugal → pt + EUR
// América Latina hispânica (exceto Brasil) → es + USD · resto do mundo → en + USD
function resolveFromCountry(country: string | null): Resolved | null {
  if (!country) return null;
  if (country === "BR") return { locale: "pt", currency: "BRL" };
  if (country === "PT") return { locale: "pt", currency: "EUR" };
  if (country === "ES") return { locale: "es", currency: "EUR" };
  if (SPANISH_LATAM.has(country)) return { locale: "es", currency: "USD" };
  return { locale: "en", currency: "USD" };
}

// Sem país (localhost): idioma do navegador. Espanhol sem país fica em USD,
// português sem país fica em BRL, como antes.
function resolveFromAcceptLanguage(acceptLanguage: string): Resolved {
  if (/^pt/i.test(acceptLanguage)) return { locale: "pt", currency: "BRL" };
  if (/^es/i.test(acceptLanguage)) return { locale: "es", currency: "USD" };
  return { locale: "en", currency: "USD" };
}

function resolveOverride(req: NextRequest): Partial<Resolved> {
  const params = req.nextUrl.searchParams;
  const locale = params.get("lang")?.toLowerCase();
  const currency = params.get("currency")?.toUpperCase();
  return {
    locale: locale && VALID_LOCALES.has(locale) ? locale : undefined,
    currency: currency && VALID_CURRENCIES.has(currency) ? currency : undefined,
  };
}

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const fromGeo =
    resolveFromCountry(request.headers.get("x-vercel-ip-country")) ??
    resolveFromAcceptLanguage(request.headers.get("accept-language") ?? "");
  const override = resolveOverride(request);
  let locale = override.locale ?? fromGeo.locale;
  let currency = override.currency ?? fromGeo.currency;

  // /crm-whatsapp e /whatsapp-multiagente só existem em espanhol: idioma
  // travado em es pra qualquer país, e moeda como a do espanhol (EUR onde já
  // é EUR, USD no resto). ?currency= continua forçando.
  if (isSpanishOnlyPath(request.nextUrl.pathname)) {
    locale = "es";
    currency = override.currency ?? (fromGeo.currency === "EUR" ? "EUR" : "USD");
  }

  // O next-intl decide o idioma pelo cookie NEXT_LOCALE da requisição; aqui
  // ele é sempre substituído pelo resolvido, e a moeda vai num header que o
  // visitante não controla (lib/request-currency.ts).
  const headers = new Headers(request.headers);
  const otherCookies = (request.headers.get("cookie") ?? "")
    .split(/;\s*/)
    .filter((c) => c && !c.startsWith("NEXT_LOCALE="));
  headers.set("cookie", [...otherCookies, `NEXT_LOCALE=${locale}`].join("; "));
  headers.set(CURRENCY_HEADER, currency);

  const response = handleI18nRouting(new NextRequest(request.nextUrl, { headers }));

  const year = 60 * 60 * 24 * 365;
  response.cookies.set("NEXT_LOCALE", locale, { maxAge: year, path: "/" });
  // Só informativo pro navegador (aviso de cookies); o servidor não lê.
  response.cookies.set("NEXT_CURRENCY", currency, { maxAge: year, path: "/" });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
