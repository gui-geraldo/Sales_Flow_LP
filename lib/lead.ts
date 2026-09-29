// Coleta, no navegador, tudo o que acompanha um lead no webhook: origem
// (UTMs e ids de clique), primeira e última visita, tempo na página,
// rolagem e dados do aparelho. Mesma ideia do widget da plataforma
// (login.talkerflow.me/api/widget.js), que é o que roda na dentistaon.

import { hasConsent } from "./consent";

export type LeadIntent ="demo" | "whatsapp" | "subscribe" | "sales";

const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "campaign_id",
  "adset_id",
  "ad_id",
] as const;

// Todos os parâmetros vão sempre no webhook; o que não veio vai como null
// (combinado com o usuário: nunca omitir a chave).
type Attribution = Record<(typeof ATTRIBUTION_PARAMS)[number], string | null>;

type Touch = {
  at: string;
  url: string;
  referrer: string | null;
  params: Attribution;
};

function emptyAttribution(): Attribution {
  return Object.fromEntries(ATTRIBUTION_PARAMS.map((key) => [key, null])) as Attribution;
}

const hasAnyParam = (params: Attribution) => Object.values(params).some(Boolean);

const KEY_FIRST_TOUCH = "sf_first_touch";
const KEY_LAST_TOUCH = "sf_last_touch";
const KEY_VISITS = "sf_visits";
const KEY_SESSION_START = "sf_session_start";
const COOKIE_ANON_ID = "sf_aid";

// Guardado em memória na carga do módulo: é o "início da visita a esta página".
const pageLoadedAt = typeof performance !== "undefined" ? Date.now() - performance.now() : Date.now();
let maxScrollPct = 0;
let initialized = false;
let scrollTracking = false;

function safeGet(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(storage: Storage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // modo privado ou armazenamento bloqueado: segue sem persistir
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function readAttribution(): Attribution {
  const query = new URLSearchParams(window.location.search);
  const out = emptyAttribution();
  for (const key of ATTRIBUTION_PARAMS) {
    const value = query.get(key);
    if (value) out[key] = value.slice(0, 300);
  }
  return out;
}

function currentTouch(): Touch {
  return {
    at: new Date().toISOString(),
    url: window.location.href.slice(0, 500),
    referrer: document.referrer ? document.referrer.slice(0, 500) : null,
    params: readAttribution(),
  };
}

// Visitas gravadas por versões antigas não tinham todas as chaves: completa com null.
function parseTouch(raw: string | null): Touch | null {
  if (!raw) return null;
  try {
    const touch = JSON.parse(raw) as Partial<Touch>;
    return {
      at: touch.at ?? "",
      url: touch.url ?? "",
      referrer: touch.referrer || null,
      params: { ...emptyAttribution(), ...(touch.params ?? {}) },
    };
  } catch {
    return null;
  }
}

// Um campo só com a origem do lead, pra filtrar e rotear no n8n. Mesma
// separação da tela de Resultados: anúncio pago x orgânico x direto.
export type LeadOrigin =
  | "google_ads"
  | "meta_ads"
  | "instagram"
  | "facebook"
  | "tiktok_ads"
  | "bing_ads"
  | "google_organic"
  | "other_utm"
  | "referral"
  | "direct";

function leadOrigin(a: Attribution, referrer: string | null): LeadOrigin {
  const source = (a.utm_source ?? "").toLowerCase();
  const medium = (a.utm_medium ?? "").toLowerCase();
  const paidMedium = /cpc|ppc|paid|ads?$|display|cpm/.test(medium);
  const metaSource = /^(fb|facebook|ig|instagram|meta)$/.test(source);
  const ref = (referrer ?? "").toLowerCase();

  if (a.gclid || a.gbraid || a.wbraid || (source === "google" && paidMedium)) return "google_ads";
  if ((a.fbclid || metaSource) && (a.campaign_id || a.adset_id || a.ad_id || paidMedium)) return "meta_ads";
  if (a.ttclid) return "tiktok_ads";
  if (a.msclkid) return "bing_ads";
  if (/^(ig|instagram)$/.test(source) || ref.includes("instagram.com")) return "instagram";
  if (/^(fb|facebook)$/.test(source) || /facebook\.com|fb\.com|fb\.me/.test(ref)) return "facebook";
  if (a.fbclid) return "facebook";
  if (source) return "other_utm";
  if (/\/\/(www\.)?google\./.test(ref)) return "google_organic";
  if (ref && !ref.includes(window.location.hostname)) return "referral";
  return "direct";
}

// Aparelho legível pra humano no CRM (o user-agent cru segue junto).
function deviceInfo() {
  const ua = navigator.userAgent;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  // iPad com iPadOS se apresenta como Mac; o toque denuncia.
  const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  const inApp = /Instagram/.test(ua)
    ? "instagram"
    : /FBAN|FBAV|FB_IAB/.test(ua)
      ? "facebook"
      : /TikTok|musical_ly|BytedanceWebview/.test(ua)
        ? "tiktok"
        : /LinkedInApp/.test(ua)
          ? "linkedin"
          : null;

  const os = /iPhone|iPod/.test(ua)
    ? "iOS"
    : /iPad/.test(ua) || iPadOS
      ? "iPadOS"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Mac OS X/.test(ua)
              ? "macOS"
              : /Linux/.test(ua)
                ? "Linux"
                : null;

  const browser = /Edg(e|A|iOS)?\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /CriOS|Chrome\//.test(ua)
          ? "Chrome"
          : /FxiOS|Firefox\//.test(ua)
            ? "Firefox"
            : /Safari\//.test(ua)
              ? "Safari"
              : null;

  const type =
    /iPad|Tablet/.test(ua) || iPadOS || (/Android/.test(ua) && !/Mobile/.test(ua))
      ? "tablet"
      : /Mobi|iPhone|iPod|Android/.test(ua)
        ? "mobile"
        : "desktop";

  return {
    type,
    os,
    browser,
    inApp,
    userAgent: ua,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    screen: `${window.screen.width}x${window.screen.height}`,
    touch,
  };
}

// Sem consentimento de cookies, não cria o identificador (só lê um que já exista).
function anonymousId(): string | null {
  let id = readCookie(COOKIE_ANON_ID);
  if (!id && hasConsent()) {
    id = crypto.randomUUID?.() ?? `${Date.now()}${Math.random().toString(36).slice(2)}`;
    writeCookie(COOKIE_ANON_ID, id, 365);
  }
  return id;
}

// Recusou os cookies: apaga o que o rastreamento de origem tinha guardado.
export function clearLeadTracking() {
  initialized = false;
  document.cookie = `${COOKIE_ANON_ID}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  for (const key of [KEY_FIRST_TOUCH, KEY_LAST_TOUCH, KEY_VISITS]) {
    try {
      localStorage.removeItem(key);
    } catch {
      // armazenamento bloqueado: nada a apagar
    }
  }
}

// Rolagem máxima: fica só em memória e segue junto com o formulário.
export function startEngagementTracking() {
  if (scrollTracking || typeof window === "undefined") return;
  scrollTracking = true;

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
    if (pct > maxScrollPct) maxScrollPct = Math.min(pct, 100);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Chamado quando há consentimento de cookies: registra primeira visita e
// visita atual (só se veio com parâmetros de campanha, pra não apagar a
// origem quando a pessoa volta direto).
export function initLeadTracking() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  anonymousId();
  const touch = currentTouch();
  const hasCampaign = hasAnyParam(touch.params);

  if (!safeGet(localStorage, KEY_FIRST_TOUCH)) {
    safeSet(localStorage, KEY_FIRST_TOUCH, JSON.stringify(touch));
  }
  if (hasCampaign || !safeGet(localStorage, KEY_LAST_TOUCH)) {
    safeSet(localStorage, KEY_LAST_TOUCH, JSON.stringify(touch));
  }

  if (!safeGet(sessionStorage, KEY_SESSION_START)) {
    safeSet(sessionStorage, KEY_SESSION_START, String(Math.round(pageLoadedAt)));
    const visits = Number(safeGet(localStorage, KEY_VISITS) || "0") + 1;
    safeSet(localStorage, KEY_VISITS, String(visits));
  }
}

// Cookie _fbc que o Pixel da Meta criaria; montado a partir do fbclid
// quando o Pixel ainda não rodou (serve pra API de Conversões depois).
function metaClickCookie(fbclid: string | null): string | null {
  const existing = readCookie("_fbc");
  if (existing) return existing;
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
}

export function collectLeadContext() {
  const now = Date.now();
  const firstTouch = parseTouch(safeGet(localStorage, KEY_FIRST_TOUCH));
  const lastTouch = parseTouch(safeGet(localStorage, KEY_LAST_TOUCH));
  const current = currentTouch();
  // Parâmetros da URL atual têm prioridade; se a pessoa navegou e a URL
  // perdeu os UTMs, vale a última visita com campanha.
  const fromUrl = hasAnyParam(current.params);
  const attribution = fromUrl || !lastTouch ? current.params : lastTouch.params;
  const referrer = fromUrl ? current.referrer : (current.referrer ?? lastTouch?.referrer ?? null);
  const sessionStart = Number(safeGet(sessionStorage, KEY_SESSION_START) || pageLoadedAt);

  return {
    origin: leadOrigin(attribution, referrer),
    anonymousId: anonymousId(),
    attribution,
    firstTouch,
    lastTouch,
    page: {
      url: current.url,
      path: window.location.pathname,
      title: document.title.slice(0, 200),
      referrer: current.referrer,
    },
    engagement: {
      timeOnPageSeconds: Math.round((now - pageLoadedAt) / 1000),
      timeInSessionSeconds: Math.round((now - sessionStart) / 1000),
      maxScrollPercent: maxScrollPct,
      visitCount: Number(safeGet(localStorage, KEY_VISITS) || "1"),
      sessionStartedAt: new Date(sessionStart).toISOString(),
    },
    device: deviceInfo(),
    cookies: {
      fbp: readCookie("_fbp"),
      fbc: metaClickCookie(attribution.fbclid),
      ga: readCookie("_ga"),
    },
    clientTimestamp: new Date(now).toISOString(),
  };
}

export type LeadContext = ReturnType<typeof collectLeadContext>;
