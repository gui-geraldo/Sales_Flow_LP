// Dados do mockup da tela /roi (Resultados). Tudo derivado de duas séries
// diárias (investimento e vendas), então cartões, gráficos, funil e origens
// batem entre si — nada contradiz nada. Valores-base em centavos de euro;
// cada idioma aplica um fator de moeda (`roiMockup.moneyFactor`).

export type RoiPeriod = "today" | "24h" | "7d" | "30d" | "90d";

/** Quantos dias (barras) cada filtro mostra. */
const PERIOD_DAYS: Record<RoiPeriod, number> = { today: 1, "24h": 2, "7d": 7, "30d": 30, "90d": 90 };

export type OriginKey = "meta_ads" | "instagram" | "google_ads" | "direct" | "unknown";

/** Último dia do período (o "hoje" do mockup) — dia em andamento, barra mais clara. */
export const TODAY = "2026-09-24";

// Últimos 30 dias, do mais antigo ao mais recente. O último é o dia em andamento.
const SPEND_30 = [24, 27, 31, 22, 26, 29, 33, 30, 25, 28, 34, 31, 27, 24, 29, 32, 35, 30, 26, 28, 33, 31, 29, 27, 32, 36, 30, 28, 31, 18];
const SALES_30 = [1, 2, 1, 0, 2, 1, 3, 2, 1, 2, 2, 3, 1, 1, 2, 2, 3, 2, 1, 2, 3, 2, 1, 2, 2, 3, 2, 2, 3, 1];

// Os 60 dias anteriores (pro filtro de 90 dias): série determinística — o
// mesmo desenho sempre — um pouco abaixo do mês atual, pra mostrar crescimento.
const SPEND_EARLIER = Array.from({ length: 60 }, (_, i) => 18 + ((i * 7) % 11) + Math.round(i / 12));
const SALES_EARLIER = Array.from({ length: 60 }, (_, i) => [1, 0, 2, 1, 1, 2, 0, 1, 2, 1, 3, 1][(i * 5) % 12]);

const SPEND_EUR = [...SPEND_EARLIER, ...SPEND_30];
const SALES = [...SALES_EARLIER, ...SALES_30];
const TICKET_EUR = 90;

const ORIGIN_SHARES: [OriginKey, number][] = [
  ["meta_ads", 0.44],
  ["instagram", 0.19],
  ["google_ads", 0.12],
  ["direct", 0.08],
  ["unknown", 0.17],
];

/** Variação contra o período anterior (fixa, só pra ilustrar). */
const DELTAS: Record<RoiPeriod, { sales: number; spend: number; roas: number; cost: number }> = {
  today: { sales: 0, spend: -0.05, roas: 0.04, cost: -0.03 },
  "24h": { sales: 0.33, spend: 0.02, roas: 0.08, cost: -0.06 },
  "7d": { sales: 0.09, spend: -0.04, roas: 0.14, cost: -0.12 },
  "30d": { sales: 0.18, spend: 0.06, roas: 0.11, cost: -0.1 },
  "90d": { sales: 0.26, spend: 0.12, roas: 0.09, cost: -0.08 },
};

/** Topo do funil (alcance, visitantes, leads) — compras vêm das vendas. */
const FUNNEL_TOP: Record<RoiPeriod, [number, number, number]> = {
  today: [640, 81, 15],
  "24h": [1290, 164, 31],
  "7d": [4650, 590, 108],
  "30d": [18400, 2310, 412],
  "90d": [51900, 6480, 1170],
};

function addDays(date: string, n: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
}

export type RoiData = {
  from: string;
  to: string;
  days: { day: string; spendCents: number; sales: number }[];
  sales: number;
  revenueCents: number;
  spendCents: number;
  roas: number;
  costPerSaleCents: number;
  deltas: { sales: number; spend: number; roas: number; cost: number };
  funnel: [number, number, number, number];
  origins: { key: OriginKey; count: number; revenueCents: number }[];
  identified: number;
};

export function roiData(period: RoiPeriod, moneyFactor: number): RoiData {
  const n = PERIOD_DAYS[period];
  const spend = SPEND_EUR.slice(-n);
  const sales = SALES.slice(-n);
  const from = addDays(TODAY, -(n - 1));
  const days = spend.map((s, i) => ({
    day: addDays(from, i),
    spendCents: Math.round(s * 100 * moneyFactor),
    sales: sales[i],
  }));

  const totalSales = sales.reduce((a, b) => a + b, 0);
  const ticketCents = Math.round(TICKET_EUR * 100 * moneyFactor);
  const revenueCents = totalSales * ticketCents;
  const spendCents = days.reduce((a, d) => a + d.spendCents, 0);

  // distribui as vendas por origem pelo método dos maiores restos: a soma
  // sempre fecha no total e, com poucas vendas (Hoy/24 horas), elas vão pras
  // origens mais comuns em vez de todas caírem em "sem origem"
  const exact = ORIGIN_SHARES.map(([key, share]) => ({ key, raw: totalSales * share }));
  const counts = exact.map((e) => Math.floor(e.raw));
  let left = totalSales - counts.reduce((a, b) => a + b, 0);
  const byRemainder = exact
    .map((e, i) => ({ i, rem: e.raw - Math.floor(e.raw) }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);
  for (const { i } of byRemainder) {
    if (left <= 0) break;
    counts[i] += 1;
    left -= 1;
  }
  const origins: RoiData["origins"] = exact.map((e, i) => ({
    key: e.key,
    count: counts[i],
    revenueCents: counts[i] * ticketCents,
  }));
  const unknown = origins.find((o) => o.key === "unknown")?.count ?? 0;

  const [audience, visitors, leads] = FUNNEL_TOP[period];

  return {
    from,
    to: TODAY,
    days,
    sales: totalSales,
    revenueCents,
    spendCents,
    roas: revenueCents / spendCents,
    costPerSaleCents: spendCents / Math.max(1, totalSales),
    deltas: DELTAS[period],
    funnel: [audience, visitors, leads, totalSales],
    origins,
    identified: totalSales - unknown,
  };
}

/* ── formatação: mesmas regras de apps/web/src/components/roi-panel/format.ts ── */

/** Dinheiro em unidades inteiras, arredondado pra cima (decisão de produto da plataforma). */
export function money(cents: number, locale: string, currency: string): string {
  return Math.ceil(cents / 100).toLocaleString(locale, { style: "currency", currency, maximumFractionDigits: 0 });
}

export function moneyCompact(cents: number, locale: string, currency: string): string {
  return Math.ceil(cents / 100).toLocaleString(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 1,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function integer(value: number, locale: string): string {
  return Math.round(value).toLocaleString(locale);
}

export function percentChange(value: number, locale: string): string {
  const rounded = Math.round(value * 100);
  const text = Math.abs(rounded).toLocaleString(locale);
  return `${rounded > 0 ? "+" : rounded < 0 ? "-" : ""}${text}%`;
}

export function times(value: number, locale: string): string {
  return `${value.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}×`;
}

export function shortDay(date: string, locale: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", timeZone: "UTC" });
}

/** Teto "redondo" do eixo (1, 2, 5 × 10^n). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * pow;
}
