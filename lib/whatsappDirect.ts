// Botão flutuante de WhatsApp abre o WhatsApp DIRETO, sem formulário
// (pedido do comercial, 20/11/2026: metade das aberturas do formulário vinha
// do ícone verde e ninguém digitava nada; a pessoa esperava conversar).
//
// A mensagem pronta termina com um CÓDIGO de 4 caracteres, que vai também no
// webhook do n8n. É por ele que o comercial cruza a conversa com a visita.
//
//   Posição 1, origem:   G Google Ads · M Meta (anúncio, Instagram, Facebook)
//                        O Google orgânico · D direto ou outro
//   Posição 2, página:   H home · A /api-oficial-whatsapp
//                        C /crm-para-whatsapp ou /crm-whatsapp
//                        W /whatsapp-multiatendimento ou /whatsapp-multiagente
//   Posição 3, país:     B Brasil (R$) · E Espanha e o resto
//   Posição 4:           aleatório (sem 0, 1, I, O), separa dois cliques iguais
//
// Ex.: GCB7 = Google Ads, página de CRM, Brasil. Legenda também no vault
// (nota "Pedido LP - Botao WhatsApp direto (20-11)").

import type { LeadContext } from "./lead";

const RANDOM_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function originChar(origin: LeadContext["origin"]): string {
  if (origin === "google_ads") return "G";
  if (origin === "meta_ads" || origin === "instagram" || origin === "facebook") return "M";
  if (origin === "google_organic") return "O";
  return "D";
}

function pageChar(path: string): string {
  if (path.includes("api-oficial")) return "A";
  if (path.includes("crm")) return "C";
  if (path.includes("multiatendimento") || path.includes("multiagente")) return "W";
  return "H";
}

function randomChar(): string {
  try {
    const n = crypto.getRandomValues(new Uint8Array(1))[0];
    return RANDOM_CHARS[n % RANDOM_CHARS.length];
  } catch {
    return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  }
}

export function whatsappDirectCode(context: LeadContext, currency: string): string {
  return (
    originChar(context.origin) +
    pageChar(context.page.path) +
    (currency === "BRL" ? "B" : "E") +
    randomChar()
  );
}

// Registro do clique: mesmo caminho do formulário (/api/lead), sem nome nem
// telefone; o servidor manda só para o n8n (a plataforma exige os dois).
export function sendWhatsappClick(input: {
  code: string;
  context: LeadContext;
  locale: string;
  currency: string;
  source: string;
  isTest: boolean;
}) {
  fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo: "clique_whatsapp",
      codigo: input.code,
      source: input.source,
      locale: input.locale,
      currency: input.currency,
      context: input.context,
      isTest: input.isTest,
    }),
    // O envio termina mesmo com a pessoa já no WhatsApp.
    keepalive: true,
  }).catch(() => {});
}
