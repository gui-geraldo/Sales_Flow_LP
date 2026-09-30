declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

// Eventos do Umami (a página já vai junto, automática). O `source` diz qual
// botão abriu o formulário: hero, preço, flutuante, CTA final etc.
function umamiEvent(event: string, data: Record<string, string>) {
  window.umami?.track(event, data);
}

// Ações de conversão do Google Ads: cada uma tem um label próprio
// (Ferramentas > Conversões > ação > Configuração da tag). Sem label, só o
// evento do GA4 é enviado.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADS_FORM_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_FORM_LABEL;
const ADS_FORM_OPEN_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_FORM_OPEN_LABEL;

function adsConversion(label: string | undefined, params: Record<string, unknown> = {}) {
  if (!ADS_ID || !label) return;
  window.gtag?.("event", "conversion", { send_to: `${ADS_ID}/${label}`, ...params });
}

// Link sem formulário (páginas de teste como a /v1): o clique já conta como lead.
export function trackLeadClick(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", { source });
  window.fbq?.("track", "Lead", { content_name: source });
  umamiEvent("lead", { source });
}

// O clique só abre o formulário; o lead conta no envio.
export function trackLeadFormOpen(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "lead_form_open", { source });
  adsConversion(ADS_FORM_OPEN_LABEL);
  window.fbq?.("trackCustom", "LeadFormOpen", { content_name: source });
  umamiEvent("lead_form_open", { source });
}

// Envio do formulário (que já abre o WhatsApp). E-mail e telefone vão como
// enhanced conversions do Google: o gtag faz o hash antes de enviar, e só
// com consentimento de cookies (sem ele o Consent Mode descarta).
export function trackLeadSubmit(
  source: string,
  intent: string,
  user?: { email: string; phone: string | null },
) {
  if (typeof window === "undefined") return;

  if (user) {
    window.gtag?.("set", "user_data", {
      email: user.email,
      ...(user.phone ? { phone_number: user.phone } : {}),
    });
  }
  window.gtag?.("event", "generate_lead", { source, intent });
  adsConversion(ADS_FORM_LABEL, { source, intent });
  window.fbq?.("track", "Lead", { content_name: source, content_category: intent });
  // Sem e-mail nem telefone: o Umami não recebe dado pessoal.
  umamiEvent("lead", { source, intent });
}
