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

// Até onde a pessoa chega na página e quanto tempo fica (14/11/2026).
// Por SEÇÃO, não por percentual de rolagem: no celular a página é ~3x mais
// comprida e "50%" cai em lugares diferentes. Cada <section> filha direta do
// <main> conta uma vez, quando o topo dela passa do meio da tela:
// evento "secao_<ordem>_<nome>" (ex.: secao_08_precos), dado { pagina }.
// Na saída (aba escondida ou página fechada, a primeira vez), um
// "tempo_pagina" com { faixa, ultima_secao, pagina }. Sem dado pessoal.
// ~12 eventos por visita: cabe com folga no plano grátis do Umami (100 mil/mês).
function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean)
    .slice(0, 3)
    .join("-")
    .slice(0, 24);
}

function sectionName(el: HTMLElement, index: number) {
  const order = String(index + 1).padStart(2, "0");
  if (index === 0) return `${order}_topo`;
  const heading = el.querySelector("h1, h2")?.textContent ?? "";
  return `${order}_${el.id || slug(heading) || "bloco"}`;
}

function timeBucket(ms: number) {
  const s = ms / 1000;
  if (s < 10) return "0-10s";
  if (s < 30) return "10-30s";
  if (s < 60) return "30-60s";
  if (s < 180) return "1-3min";
  return "3min+";
}

export function startEngagementEvents(): () => void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return () => {};

  const pagina = window.location.pathname;
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
  const names = new Map<Element, { name: string; index: number }>();
  sections.forEach((el, index) => names.set(el, { name: sectionName(el, index), index }));

  const startedAt = performance.now();
  let deepest = -1;
  let deepestName = "";
  let timeSent = false;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const info = names.get(entry.target);
        if (!info) continue;
        observer.unobserve(entry.target);
        umamiEvent(`secao_${info.name}`, { pagina });
        if (info.index > deepest) {
          deepest = info.index;
          deepestName = info.name;
        }
      }
    },
    // A seção conta quando entra na metade de cima da tela.
    { rootMargin: "0px 0px -50% 0px", threshold: 0 },
  );
  sections.forEach((el) => observer.observe(el));

  const sendTime = () => {
    if (timeSent) return;
    timeSent = true;
    umamiEvent("tempo_pagina", {
      faixa: timeBucket(performance.now() - startedAt),
      ultima_secao: deepestName || "nenhuma",
      pagina,
    });
  };
  const onVisibility = () => {
    if (document.visibilityState === "hidden") sendTime();
  };
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", sendTime);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", sendTime);
  };
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
  user?: { email?: string; phone: string | null },
) {
  if (typeof window === "undefined") return;

  if (user && (user.email || user.phone)) {
    window.gtag?.("set", "user_data", {
      ...(user.email ? { email: user.email } : {}),
      ...(user.phone ? { phone_number: user.phone } : {}),
    });
  }
  window.gtag?.("event", "generate_lead", { source, intent });
  adsConversion(ADS_FORM_LABEL, { source, intent });
  window.fbq?.("track", "Lead", { content_name: source, content_category: intent });
  // Sem e-mail nem telefone: o Umami não recebe dado pessoal.
  umamiEvent("lead", { source, intent });
}
