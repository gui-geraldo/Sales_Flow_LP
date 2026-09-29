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

type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

type Touch = {
  at: string;
  url: string;
  referrer: string;
  params: Attribution;
};

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
  const out: Attribution = {};
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
    referrer: (document.referrer || "").slice(0, 500),
    params: readAttribution(),
  };
}

function parseTouch(raw: string | null): Touch | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Touch;
  } catch {
    return null;
  }
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
  const hasCampaign = Object.keys(touch.params).length > 0;

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
function metaClickCookie(fbclid: string | undefined): string | null {
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
  const attribution: Attribution = {
    ...(lastTouch?.params ?? {}),
    ...current.params,
  };
  const sessionStart = Number(safeGet(sessionStorage, KEY_SESSION_START) || pageLoadedAt);

  return {
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
    device: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.slice(0, 5) ?? [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      touch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    },
    cookies: {
      fbp: readCookie("_fbp"),
      fbc: metaClickCookie(attribution.fbclid),
      ga: readCookie("_ga"),
    },
    clientTimestamp: new Date(now).toISOString(),
  };
}

export type LeadContext = ReturnType<typeof collectLeadContext>;
