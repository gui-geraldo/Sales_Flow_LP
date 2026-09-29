import { NextRequest, NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";

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

  const city = req.headers.get("x-vercel-ip-city");
  const payload = {
    event: "lead",
    leadId: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    lead: {
      name,
      email,
      phone,
      phoneAsTyped: str(body.phone, 40),
      consent: true,
      consentText: str(body.consentText, 500),
    },
    intent,
    source: str(body.source, 80),
    locale,
    currency,
    // Menos de 2 s entre abrir e enviar é suspeito de robô: vai marcado, não barrado.
    formFillSeconds: Math.round(fillMs / 100) / 10,
    suspectedBot: fillMs > 0 && fillMs < 2000,
    context: body.context ?? null,
    server: {
      ip,
      country: req.headers.get("x-vercel-ip-country"),
      region: req.headers.get("x-vercel-ip-country-region"),
      city: city ? decodeURIComponent(city) : null,
      latitude: req.headers.get("x-vercel-ip-latitude"),
      longitude: req.headers.get("x-vercel-ip-longitude"),
      timezone: req.headers.get("x-vercel-ip-timezone"),
      userAgent: req.headers.get("user-agent"),
      acceptLanguage: req.headers.get("accept-language"),
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
