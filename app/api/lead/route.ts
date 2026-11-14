import { NextRequest, NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";

// Recebe o formulário curto (nome, e-mail, telefone) e repassa a DOIS
// webhooks configurados na Vercel, em paralelo e independentes:
// 1. n8n (LEAD_WEBHOOK_URL + LEAD_WEBHOOK_SECRET): tudo o que o navegador
//    coletou (lib/lead.ts) + geolocalização da Vercel, no formato do Studio.
// 2. Plataforma Sales Flow (SALESFLOW_WEBHOOK_URL + SALESFLOW_WEBHOOK_TOKEN):
//    só o contato (name, phone, email, id, occurred_at).
// As URLs e tokens nunca vão pro navegador.

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.LEAD_WEBHOOK_SECRET;
const SALESFLOW_WEBHOOK_URL = process.env.SALESFLOW_WEBHOOK_URL;
const SALESFLOW_WEBHOOK_TOKEN = process.env.SALESFLOW_WEBHOOK_TOKEN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTENTS = new Set(["demo", "whatsapp", "subscribe", "sales"]);

// Limite simples por IP (melhor esforço: cada instância serverless tem o seu).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const recentByIp = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);
  return hits.length > RATE_MAX;
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

type Obj = Record<string, unknown>;
const obj = (value: unknown): Obj => (value && typeof value === "object" ? (value as Obj) : {});

// "/caminho?query" de uma URL completa ("" se não der pra ler).
function pathAndQuery(url: unknown): string {
  if (typeof url !== "string" || !url) return "";
  try {
    const u = new URL(url);
    return (u.pathname + u.search).slice(0, 1000);
  } catch {
    return "";
  }
}

// De onde veio o tráfego, em uma palavra (como o Studio manda: "google").
function trafficSource(origin: string, utmSource: string, referrer: string): string {
  if (origin === "google_ads" || origin === "google_organic") return "google";
  if (origin === "meta_ads" || origin === "facebook") return "facebook";
  if (origin === "instagram") return "instagram";
  if (origin === "tiktok_ads") return "tiktok";
  if (origin === "bing_ads") return "bing";
  if (origin === "other_utm" && utmSource) return utmSource.toLowerCase();
  if (origin === "referral" && referrer) {
    try {
      return new URL(referrer).hostname.replace(/^www\./, "");
    } catch {
      return "referral";
    }
  }
  return "direto";
}

// Monta o corpo no formato do Studio das Pedras, a partir do que o navegador
// coletou (lib/lead.ts) e da geolocalização que a Vercel anexa na borda.
function buildStudioPayload(body: Obj, name: string, email: string, req: NextRequest) {
  const context = obj(body.context);
  const attribution = obj(context.attribution);
  const page = obj(context.page);
  const lastTouch = obj(context.lastTouch);
  const firstTouch = obj(context.firstTouch);
  const device = obj(context.device);
  const a = (key: string) => (typeof attribution[key] === "string" ? (attribution[key] as string) : "");

  // Página de entrada com a query da campanha: a atual, se ainda tem
  // parâmetros; senão a última visita com campanha; senão a primeira.
  const currentUrl = typeof page.url === "string" ? page.url : "";
  const landingUrl = currentUrl.includes("?")
    ? currentUrl
    : (lastTouch.url as string) || (firstTouch.url as string) || currentUrl;
  const referrer =
    (typeof page.referrer === "string" && page.referrer) ||
    (typeof lastTouch.referrer === "string" && lastTouch.referrer) ||
    "";

  const cityHeader = req.headers.get("x-vercel-ip-city");
  const city = cityHeader ? decodeURIComponent(cityHeader) : "";
  const region = req.headers.get("x-vercel-ip-country-region") ?? "";

  return {
    nome: name,
    telefone: str(body.phone, 40),
    cidade: city ? (region ? `${city} - ${region}` : city) : "",
    email,
    pedra: "",
    mensagem: "",
    origem: typeof page.path === "string" ? page.path : "/",
    canal: "whatsapp",
    origemTrafego: trafficSource(str(context.origin, 40), a("utm_source"), referrer),
    referrer,
    landing: pathAndQuery(landingUrl),
    utm: {
      source: a("utm_source"),
      medium: a("utm_medium"),
      campaign: a("utm_campaign"),
      content: a("utm_content"),
      term: a("utm_term"),
    },
    gclid: a("gclid"),
    gbraid: a("gbraid"),
    wbraid: a("wbraid"),
    userAgent:
      (typeof device.userAgent === "string" && device.userAgent) || req.headers.get("user-agent") || "",
    recebidoEm: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Campo invisível: gente não preenche, robô costuma preencher.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const locale = str(body.locale, 5) || "es";
  const currency = str(body.currency, 3) || "EUR";
  const name = str(body.name, 120);
  // E-mail opcional desde 14/11/2026 (o formulário não pede mais): se vier e
  // for válido, segue; senão vai vazio (chave mantida no payload do n8n).
  const rawEmail = str(body.email, 200).toLowerCase();
  const email = EMAIL_RE.test(rawEmail) ? rawEmail : "";
  const phone = normalizePhone(str(body.phone, 40), locale, currency);
  const intent = str(body.intent, 20);

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!phone) errors.push("phone");
  if (body.consent !== true) errors.push("consent");
  if (!INTENTS.has(intent)) errors.push("intent");
  if (errors.length) {
    return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  if (ip && rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Payload no MESMO formato do site do Studio das Pedras (pedido do usuário
  // em 10/11/2026), para o n8n tratar os dois sites com o mesmo fluxo. Campos
  // que a LP não tem ("pedra", "mensagem") vão vazios; nunca omitir chave.
  // Depois das chaves do Studio, 5 a mais (aprovado pelo usuário em 10/11):
  // o fluxo do Studio ignora, o da LP usa.
  const fillMs = Number(body.fillMs) || 0;
  // Chave criada quando o formulário abriu: o mesmo lead enviado duas vezes
  // chega com a mesma chave (serve pra não duplicar no n8n).
  const clientKey = str(body.idempotencyKey, 64);
  const leadId = /^[\w-]{8,64}$/.test(clientKey) ? clientKey : crypto.randomUUID();
  const BUTTONS: Record<string, string> = {
    demo: "demo",
    whatsapp: "whatsapp",
    subscribe: "assinar",
    sales: "vendas",
  };
  const payload = {
    ...buildStudioPayload(body, name, email, req),
    // País da visita (Vercel); sem ele, pela moeda. O mesmo webhook recebe
    // Brasil e Espanha: é por aqui que o n8n separa.
    pais: req.headers.get("x-vercel-ip-country") || (currency === "BRL" ? "BR" : ""),
    // Prova de consentimento (LGPD/GDPR): o texto que a pessoa aceitou e quando.
    consentimento: {
      texto: str(body.consentText, 500),
      aceitoEm: new Date().toISOString(),
    },
    botao: BUTTONS[intent] ?? intent,
    leadId,
    // Menos de 2 s entre abrir e enviar o formulário: provável robô (vai marcado, não barrado).
    suspeitaRobo: fillMs > 0 && fillMs < 2000,
  };

  // Dois destinos, disparados JUNTOS e independentes: o n8n (de sempre) e a
  // plataforma Sales Flow (a mais, desde 10/11/2026). Um não espera nem
  // derruba o outro; a resposta ao navegador continua dependendo só do n8n.
  const [n8n] = await Promise.all([
    sendToN8n(payload),
    sendToSalesFlow({
      name,
      // Só dígitos com o código do país (ex.: 5511999998888), como pede a plataforma.
      phone: (phone ?? "").replace(/\D/g, ""),
      // A plataforma só exige nome e telefone: e-mail só vai se houver.
      ...(email ? { email } : {}),
      id: leadId,
      occurred_at: payload.recebidoEm,
    }),
  ]);
  if (n8n === "failed") {
    return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: n8n === "sent" });
}

// Webhook 1 (n8n, de sempre): igual ao que já funcionava.
async function sendToN8n(payload: Obj): Promise<"sent" | "skipped" | "failed"> {
  if (!WEBHOOK_URL) {
    // Sem webhook configurado (ex.: localhost): registra no log pra conferir.
    console.warn("[lead] LEAD_WEBHOOK_URL não configurada; lead não enviado:\n" + JSON.stringify(payload, null, 2));
    return "skipped";
  }
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Igual ao Studio: Authorization Bearer. O X-Webhook-Secret antigo vai
        // junto até o n8n da LP passar a conferir o Bearer (não atrapalha).
        ...(WEBHOOK_SECRET
          ? { Authorization: `Bearer ${WEBHOOK_SECRET}`, "X-Webhook-Secret": WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook respondeu ${res.status}`);
    return "sent";
  } catch (err) {
    console.error("[lead] falha ao enviar ao webhook:", err, JSON.stringify(payload));
    return "failed";
  }
}

// Webhook 2 (plataforma Sales Flow, entrada de contatos). Só name e phone são
// obrigatórios; sem "amount" (não é venda). Falha aqui só vai pro log: nunca
// muda a resposta ao visitante nem o envio ao n8n.
async function sendToSalesFlow(contact: {
  name: string;
  phone: string;
  email?: string;
  id: string;
  occurred_at: string;
}): Promise<void> {
  if (!SALESFLOW_WEBHOOK_URL || !SALESFLOW_WEBHOOK_TOKEN) {
    console.warn("[lead] Sales Flow: SALESFLOW_WEBHOOK_URL/TOKEN não configurados; contato não enviado à plataforma.");
    return;
  }
  try {
    const res = await fetch(SALESFLOW_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SALESFLOW_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify(contact),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Sales Flow respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (err) {
    console.error("[lead] falha ao enviar à plataforma Sales Flow:", err, JSON.stringify({ id: contact.id }));
  }
}
