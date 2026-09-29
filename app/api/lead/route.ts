import { NextRequest, NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { getCurrencyConfig, type Currency } from "@/lib/pricing";

const VALID_CURRENCIES = new Set(["BRL", "EUR", "USD"]);

// Recebe o formulário curto (nome, e-mail, telefone) e repassa ao webhook
// configurado na Vercel (LEAD_WEBHOOK_URL), junto com tudo o que o navegador
// coletou (lib/lead.ts) e a geolocalização que a Vercel anexa na borda.
// A URL do webhook nunca vai pro navegador.

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.LEAD_WEBHOOK_SECRET;

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
  const email = str(body.email, 200).toLowerCase();
  const phone = normalizePhone(str(body.phone, 40), locale, currency);
  const intent = str(body.intent, 20);
  const fillMs = Number(body.fillMs) || 0;

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
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

  // Chave criada quando o formulário abriu: o mesmo lead enviado duas vezes
  // chega com a mesma chave (o n8n usa pra não duplicar).
  const clientKey = str(body.idempotencyKey, 64);
  const leadId = /^[\w-]{8,64}$/.test(clientKey) ? clientKey : crypto.randomUUID();

  // A origem calculada no navegador sobe pro topo do payload (fácil de filtrar no n8n).
  const { origin: rawOrigin, ...clientContext } = (body.context ?? {}) as Record<string, unknown>;
  const origin = typeof rawOrigin === "string" ? rawOrigin : null;
  const context = body.context ? clientContext : null;

  // Plano do botão clicado (demo e WhatsApp não são de um plano) e o preço
  // do Profissional que a página mostrou nessa moeda.
  const plan = intent === "subscribe" ? "profissional" : intent === "sales" ? "escala" : null;
  const priceShown = VALID_CURRENCIES.has(currency)
    ? getCurrencyConfig(currency as Currency).amount
    : null;

  const city = req.headers.get("x-vercel-ip-city");
  // Todos os campos vão sempre; o que não existe vai como null.
  const payload = {
    event: "lead",
    leadId,
    receivedAt: new Date().toISOString(),
    lead: {
      name,
      email,
      phone,
      phoneAsTyped: str(body.phone, 40) || null,
      consent: true,
      consentText: str(body.consentText, 500) || null,
    },
    origin,
    intent,
    plan,
    priceShown,
    source: str(body.source, 80) || null,
    locale,
    currency,
    // Menos de 2 s entre abrir e enviar é suspeito de robô: vai marcado, não barrado.
    formFillSeconds: Math.round(fillMs / 100) / 10,
    suspectedBot: fillMs > 0 && fillMs < 2000,
    context,
    server: {
      ip: ip || null,
      country: req.headers.get("x-vercel-ip-country"),
      region: req.headers.get("x-vercel-ip-country-region"),
      city: city ? decodeURIComponent(city) : null,
      timezone: req.headers.get("x-vercel-ip-timezone"),
    },
  };

  if (!WEBHOOK_URL) {
    // Sem webhook configurado (ex.: localhost): registra no log pra conferir.
    console.warn("[lead] LEAD_WEBHOOK_URL não configurada; lead não enviado:\n" + JSON.stringify(payload, null, 2));
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": leadId,
        ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook respondeu ${res.status}`);
  } catch (err) {
    console.error("[lead] falha ao enviar ao webhook:", err, JSON.stringify(payload));
    return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
