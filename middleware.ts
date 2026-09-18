import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const VALID_CURRENCIES = new Set(["BRL", "EUR", "USD"]);

// América Latina de língua espanhola (Espanha fica de fora, tratada à parte).
const SPANISH_LATAM = new Set([
  "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);

// Regras de negócio (confirmadas com o usuário):
// Brasil → pt + BRL · Espanha → es + EUR · Portugal → pt + EUR
// América Latina hispânica (exceto Brasil) → es + USD · resto do mundo → en + USD
function resolveFromCountry(country: string | null): { locale: string; currency: string } | null {
  if (!country) return null;
  if (country === "BR") return { locale: "pt", currency: "BRL" };
  if (country === "PT") return { locale: "pt", currency: "EUR" };
  if (country === "ES") return { locale: "es", currency: "EUR" };
  if (SPANISH_LATAM.has(country)) return { locale: "es", currency: "USD" };
  return { locale: "en", currency: "USD" };
}

function resolveFromAcceptLanguage(acceptLanguage: string): { locale: string; currency: string } {
  if (/^pt/i.test(acceptLanguage)) return { locale: "pt", currency: "BRL" };
  if (/^es/i.test(acceptLanguage)) return { locale: "es", currency: "USD" };
  return { locale: "en", currency: "USD" };
}

// Hierarquia: 1) escolha manual do visitante (cookies) 2) geolocalização
// (país, via header de edge do Vercel) 3) idioma do navegador 4) padrão (pt/BRL).
function resolveLocaleAndCurrency(req: NextRequest): { locale: string; currency: string } {
  const manualLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const manualCurrency = req.cookies.get("NEXT_CURRENCY")?.value;
  if (manualLocale && manualCurrency) {
    return { locale: manualLocale, currency: manualCurrency };
  }

  const country = req.headers.get("x-vercel-ip-country");
  const fromGeo = resolveFromCountry(country);
  if (fromGeo) return fromGeo;

  const acceptLanguage = req.headers.get("accept-language") ?? "";
  return resolveFromAcceptLanguage(acceptLanguage);
}

const handleI18nRouting = createMiddleware(routing);

// Override de teste: ?currency=eur na URL força a moeda dessa visita,
// sem precisar trocar de país/geolocalização real. Ex.: /es?currency=usd
function getCurrencyOverride(request: NextRequest): string | null {
  const raw = request.nextUrl.searchParams.get("currency");
  if (!raw) return null;
  const currency = raw.toUpperCase();
  return VALID_CURRENCIES.has(currency) ? currency : null;
}

export default function middleware(request: NextRequest) {
  const { locale, currency } = resolveLocaleAndCurrency(request);
  const currencyOverride = getCurrencyOverride(request);
  const resolvedCurrency = currencyOverride ?? currency;

  const alreadyHasLocaleCookie = request.cookies.has("NEXT_LOCALE");
  const headers = new Headers(request.headers);
  if (!alreadyHasLocaleCookie) {
    headers.set("cookie", `${request.headers.get("cookie") ?? ""}; NEXT_LOCALE=${locale}`);
  }

  const requestWithLocale = new NextRequest(request.nextUrl, { headers });
  const response = handleI18nRouting(requestWithLocale);

  if (!alreadyHasLocaleCookie) {
    response.cookies.set("NEXT_LOCALE", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  if (currencyOverride || !request.cookies.has("NEXT_CURRENCY")) {
    response.cookies.set("NEXT_CURRENCY", resolvedCurrency, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
