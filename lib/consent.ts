// Consentimento de cookies (Google Analytics/Ads, Pixel da Meta e o
// rastreamento de origem do formulário em lib/lead.ts).
// Fora do Brasil é opt-in (RGPD/LSSI): nada de medição até a pessoa aceitar.
// No Brasil o banner aparece, mas a medição começa ligada e dá pra recusar.

export type Consent = "granted" | "denied";

export const CONSENT_COOKIE = "sf_consent";
// Disparado com a escolha nova em `detail`.
export const CONSENT_EVENT = "sf:consent";
// Pede pro banner abrir de novo (link "Cookies" do rodapé).
export const CONSENT_OPEN_EVENT = "sf:consent-open";

const MAX_AGE_DAYS = 180;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function currencyFromCookie(): string | null {
  return readCookie("NEXT_CURRENCY");
}

export function storedConsent(): Consent | null {
  const value = readCookie(CONSENT_COOKIE);
  return value === "granted" || value === "denied" ? value : null;
}

export function defaultConsent(): Consent {
  return currencyFromCookie() === "BRL" ? "granted" : "denied";
}

export function hasConsent(): boolean {
  return (storedConsent() ?? defaultConsent()) === "granted";
}

export function saveConsent(consent: Consent) {
  const expires = new Date(Date.now() + MAX_AGE_DAYS * 864e5).toUTCString();
  document.cookie = `${CONSENT_COOKIE}=${consent};expires=${expires};path=/;SameSite=Lax`;

  const state = consent === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  window.fbq?.("consent", consent === "granted" ? "grant" : "revoke");
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
}

// Mesma regra de hasConsent, em JS puro, pro script inline do gtag, que
// precisa declarar o consentimento antes de qualquer outra chamada.
export const CONSENT_DEFAULT_SNIPPET = `
  var sfc = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=(granted|denied)/);
  var sfState = sfc ? sfc[1] : (/(?:^|; )NEXT_CURRENCY=BRL(?:;|$)/.test(document.cookie) ? 'granted' : 'denied');
  gtag('consent', 'default', {
    ad_storage: sfState,
    ad_user_data: sfState,
    ad_personalization: sfState,
    analytics_storage: sfState
  });
`;
