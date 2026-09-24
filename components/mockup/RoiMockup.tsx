"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  TODAY,
  integer,
  money,
  moneyCompact,
  niceMax,
  roiData,
  shortDay,
  times,
  type RoiData,
  type RoiPeriod,
} from "./roi-data";

// Réplica viva da tela /roi (Resultados) da plataforma (auto_agendador,
// apps/web/src/app/[locale]/(app)/roi + components/roi-panel): mesmas
// classes, estrutura e textos de PeriodPicker (só a 1ª linha), SummaryCards,
// DailyBars, FunnelBlock e OriginsBlock. Tela fixa de DESIGN_W de largura,
// escalada pra caber onde for colocada; a altura acompanha o conteúdo.
//
// Animação: quando entra na tela, números contam, barras crescem e o funil e
// as origens se preenchem; depois um "clique" alterna o filtro entre 7 e 30
// dias, em loop, e tudo se recalcula animado.

const DESIGN_W = 860;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Alternância do filtro: 7 dias → (clique) 30 dias → (clique) 7 dias… */
const PHASE_MS = 7000;
const PRESS_MS = 320;

type T = ReturnType<typeof useTranslations>;

/** Escala pela largura disponível; altura = altura natural do conteúdo × escala. */
function useFitScale() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [contentH, setContentH] = useState(0);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      setWidth(outer.offsetWidth);
      setContentH(inner.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return { outerRef, innerRef, scale: width ? width / DESIGN_W : null, contentH };
}

/** Número que conta até o valor novo (a partir do anterior) — pula direto com "reduzir movimento". */
function CountUp({ value, format }: { value: number; format: (v: number) => string }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 1,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <>{format(display)}</>;
}

export function RoiMockup({
  theme = "light",
  className,
  staticPeriod,
}: {
  theme?: "light" | "dark";
  className?: string;
  /** fixa um período, sem loop (bancada de revisão) */
  staticPeriod?: RoiPeriod;
}) {
  const t = useTranslations("roiMockup");
  const locale = useLocale();
  const currency = t("currency");
  const factor = Number(t("moneyFactor")) || 1;
  const reduceMotion = useReducedMotion();
  const { outerRef, innerRef, scale, contentH } = useFitScale();
  const inView = useInView(outerRef, { once: true, amount: 0.25 });

  const [period, setPeriod] = useState<RoiPeriod>(staticPeriod ?? "7d");
  const [pressed, setPressed] = useState<RoiPeriod | null>(null);
  // a pessoa clicou num filtro: o loop automático para e o controle é dela
  const [userPicked, setUserPicked] = useState(false);
  const started = staticPeriod !== undefined || reduceMotion || inView || userPicked;

  function pick(p: RoiPeriod) {
    setUserPicked(true);
    setPressed(null);
    setPeriod(p);
  }

  // loop do filtro: 7d → clique → 30d → clique → 7d… (até alguém clicar)
  useEffect(() => {
    if (staticPeriod !== undefined || reduceMotion || !inView || userPicked) return;
    let next: RoiPeriod = "30d";
    const timers: ReturnType<typeof setTimeout>[] = [];
    const tick = () => {
      const target = next;
      setPressed(target);
      timers.push(
        setTimeout(() => {
          setPressed(null);
          setPeriod(target);
        }, PRESS_MS),
      );
      next = target === "30d" ? "7d" : "30d";
    };
    const interval = setInterval(tick, PHASE_MS);
    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion, staticPeriod, userPicked]);

  const data = roiData(reduceMotion && staticPeriod === undefined && !userPicked ? "30d" : period, factor);
  const fmt = {
    money: (c: number) => money(c, locale, currency),
    compact: (c: number) => moneyCompact(c, locale, currency),
    int: (v: number) => integer(v, locale),
  };

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ height: scale ? contentH * scale : undefined, aspectRatio: scale ? undefined : "860 / 1000" }}
    >
      <div
        className={theme === "dark" ? "dark" : ""}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DESIGN_W,
          transform: `scale(${scale ?? 0})`,
          transformOrigin: "top left",
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <main ref={innerRef} className="select-none space-y-5 bg-slate-50 p-6 font-sans text-slate-900 dark:bg-slate-950">
          {/* Cabeçalho + 1ª linha do seletor de período, na mesma altura do título */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold dark:text-slate-100">{t("title")}</h1>
            <PeriodChips active={period} pressed={pressed} onPick={pick} t={t} />
          </div>

          <SummaryCards data={data} started={started} t={t} fmt={fmt} locale={locale} />
          {/* (sem a linha "vs. período anterior", sem "Ver como tabla" e sem os
              textos de apoio do funil/origens — versão enxuta pra LP) */}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="rounded-[12px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-2 text-sm font-medium dark:text-slate-100">{t("charts.spend")}</h2>
                <DailyBars
                  key={`spend-${period}`}
                  values={data.days.map((d) => d.spendCents)}
                  days={data.days.map((d) => d.day)}
                  started={started}
                  colorClass="fill-slate-400 dark:fill-slate-500"
                  formatAxis={fmt.compact}
                  locale={locale}
                />
              </div>
              <div className="rounded-[12px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-2 text-sm font-medium dark:text-slate-100">{t("charts.sales")}</h2>
                <DailyBars
                  key={`sales-${period}`}
                  values={data.days.map((d) => d.sales)}
                  days={data.days.map((d) => d.day)}
                  started={started}
                  colorClass="fill-brand-600 dark:fill-brand-400"
                  formatAxis={fmt.int}
                  locale={locale}
                  minMax={2}
                />
              </div>
            </div>
            <Funnel values={started ? data.funnel : [0, 0, 0, 0]} t={t} locale={locale} />
          </div>

          <Origins data={data} started={started} t={t} fmt={fmt} period={period} />
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * 1ª linha do PeriodPicker, sem o "Personalizado" (removido a pedido). Hoy…90
 * días são botões de verdade: a pessoa pode explorar o painel.
 */
function PeriodChips({
  active,
  pressed,
  onPick,
  t,
}: {
  active: RoiPeriod;
  pressed: RoiPeriod | null;
  onPick: (p: RoiPeriod) => void;
  t: T;
}) {
  const chips: { key: RoiPeriod; label: string }[] = [
    { key: "today", label: t("period.today") },
    { key: "24h", label: t("period.last24h") },
    { key: "7d", label: t("period.days7") },
    { key: "30d", label: t("period.days30") },
    { key: "90d", label: t("period.days90") },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((c) => {
        const className = [
          "rounded-full px-3 py-1 text-xs transition-colors duration-300",
          active === c.key ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
          pressed === c.key ? "ring-2 ring-brand-300" : "",
        ].join(" ");
        const key = c.key;
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onPick(key)}
            aria-pressed={active === key}
            animate={pressed === key ? { scale: 0.9 } : { scale: 1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className={`${className} cursor-pointer ${active === key ? "" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}
          >
            {c.label}
          </motion.button>
        );
      })}
    </div>
  );
}

type Fmt = { money: (c: number) => string; compact: (c: number) => string; int: (v: number) => string };

function Card({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums dark:text-slate-100">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</div>
    </div>
  );
}

function SummaryCards({
  data,
  started,
  t,
  fmt,
  locale,
}: {
  data: RoiData;
  started: boolean;
  t: T;
  fmt: Fmt;
  locale: string;
}) {
  const v = (n: number) => (started ? n : 0);
  return (
    <div className="grid grid-cols-4 gap-3">
      <Card
        label={t("cards.sales")}
        value={<CountUp value={v(data.sales)} format={fmt.int} />}
        sub={t("cards.salesSub", { revenue: fmt.money(data.revenueCents) })}
      />
      <Card
        label={t("cards.spend")}
        value={<CountUp value={v(data.spendCents)} format={fmt.money} />}
        sub={t("cards.spendSub")}
      />
      <Card
        label={t("cards.return")}
        value={<CountUp value={v(data.roas)} format={(x) => times(x, locale)} />}
        sub={t("cards.returnSubShort")}
      />
      <Card
        label={t("cards.costPerSale")}
        value={<CountUp value={v(data.costPerSaleCents)} format={fmt.money} />}
        sub={t("cards.costPerSaleSub")}
      />
    </div>
  );
}

/* ── Barras por dia (mesma geometria do DailyBars da plataforma) ────────── */

const BW = 640;
const BH = 168;
const PAD = { left: 64, right: 8, top: 12, bottom: 28 };

function barPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h));
  return [
    `M${x},${y + h}`,
    `V${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `H${x + w - radius}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `V${y + h}`,
    "Z",
  ].join(" ");
}

function DailyBars({
  values,
  days,
  started,
  colorClass,
  formatAxis,
  locale,
  minMax,
}: {
  values: number[];
  days: string[];
  started: boolean;
  colorClass: string;
  formatAxis: (v: number) => string;
  locale: string;
  minMax?: number;
}) {
  // gráfico de contagem: teto mínimo 2, senão o meio do eixo (0,5) vira "1" arredondado
  const max = Math.max(minMax ?? 0, niceMax(Math.max(0, ...values)));
  const innerW = BW - PAD.left - PAD.right;
  const innerH = BH - PAD.top - PAD.bottom;
  const slot = values.length > 0 ? innerW / values.length : innerW;
  const barW = Math.min(28, slot * 0.64);
  const yOf = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const step = Math.max(1, Math.ceil(values.length / 6));
  const showLabel = (i: number) =>
    i === 0 || i === values.length - 1 || (i % step === 0 && values.length - 1 - i >= step / 2);

  return (
    <div>
      <svg viewBox={`0 0 ${BW} ${BH}`} className="h-auto w-full">
        {[0, 0.5, 1].map((f) => {
          const y = yOf(max * f);
          return (
            <g key={f}>
              <line
                x1={PAD.left}
                x2={BW - PAD.right}
                y1={y}
                y2={y}
                className={f === 0 ? "stroke-slate-300 dark:stroke-slate-600" : "stroke-slate-200 dark:stroke-slate-800"}
                strokeWidth={1}
              />
              <text x={PAD.left - 6} y={y + 3.5} textAnchor="end" className="fill-slate-500 text-[14px] dark:fill-slate-400">
                {formatAxis(max * f)}
              </text>
            </g>
          );
        })}
        {values.map((v, i) => {
          const h = (v / max) * innerH;
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const partial = days[i] === TODAY;
          return (
            <g key={days[i]}>
              {v > 0 && (
                <motion.path
                  d={barPath(x, yOf(v), barW, h, 4)}
                  className={colorClass}
                  opacity={partial ? 0.55 : 1}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: started ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: started ? 0.1 + i * (0.6 / values.length) : 0, ease: EASE_OUT }}
                  style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                />
              )}
              {showLabel(i) && (
                <text x={i === values.length - 1 && values.length > 1 ? BW - PAD.right : PAD.left + slot * (i + 0.5)} y={BH - 7} textAnchor={i === values.length - 1 && values.length > 1 ? "end" : "middle"} className="fill-slate-500 text-[14px] dark:fill-slate-400">
                  {shortDay(days[i], locale)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Funil (mesma geometria FIXA do FunnelBlock da plataforma) ──────────── */

type BandGeo = {
  fill: string;
  rim: string;
  ellipseCy: number;
  ellipseRy: number;
  ellipseRx: number;
  topRightX: number;
  topY: number;
  botRightX: number;
  botY: number;
  fitaX0: number;
  fitaY0: number;
  fitaY1: number;
  fitaEndX: number;
  fitaR: number;
  corpo: string;
  numWeight: number;
};

const CX = 917;
const SCALE = 1.15;
const VIEW_W = 2339;
const VIEW_H = 1653;

const BANDS: BandGeo[] = [
  {
    fill: "#D6203F", rim: "#A2243B",
    ellipseCy: 99.0, ellipseRy: 49.0, ellipseRx: 644.0,
    topRightX: 1561.0, topY: 99.0, botRightX: 1408.0, botY: 427,
    fitaX0: 1410, fitaY0: 145, fitaY1: 346, fitaEndX: 2293, fitaR: 100.5,
    corpo: "M 273.0 99.0 L 1561.0 99.0 L 1436.0 399 Q 1422.0 419 1408.0 427 L 426.0 427 Q 412.0 419 398.0 399 Z",
    numWeight: 0.48,
  },
  {
    fill: "#F2CC1A", rim: "#BA9D17",
    ellipseCy: 486.0, ellipseRy: 37.0, ellipseRx: 502.5,
    topRightX: 1419.5, topY: 486.0, botRightX: 1259.0, botY: 801,
    fitaX0: 1255, fitaY0: 541, fitaY1: 743, fitaEndX: 2210, fitaR: 101,
    corpo: "M 414.5 486.0 L 1419.5 486.0 L 1287.0 773 Q 1273.0 793 1259.0 801 L 575.0 801 Q 561.0 793 547.0 773 Z",
    numWeight: 0.48,
  },
  {
    fill: "#BFBE31", rim: "#93932E",
    ellipseCy: 847.5, ellipseRy: 23.5, ellipseRx: 336.5,
    topRightX: 1253.5, topY: 847.5, botRightX: 1090.5, botY: 1148,
    fitaX0: 1085, fitaY0: 915, fitaY1: 1114, fitaEndX: 2116, fitaR: 99,
    corpo: "M 580.5 847.5 L 1253.5 847.5 L 1118.5 1120 Q 1104.5 1140 1090.5 1148 L 743.5 1148 Q 729.5 1140 715.5 1120 Z",
    numWeight: 0.46,
  },
  {
    fill: "#91B45C", rim: "#78934F",
    ellipseCy: 1190.5, ellipseRy: 11.5, ellipseRx: 169.0,
    topRightX: 1086.0, topY: 1190.5, botRightX: 917, botY: 1465,
    fitaX0: 925, fitaY0: 1217, fitaY1: 1417, fitaEndX: 2023, fitaR: 100,
    corpo: "M 748.0 1190.5 L 1086.0 1190.5 L 939 1435 Q 925 1457 917 1465 Q 909 1457 895 1435 Z",
    numWeight: 0.34,
  },
];

const STAGE_KEYS = ["audience", "visitors", "leads", "purchases"] as const;

function wallXAt(b: BandGeo, y: number): number {
  const tt = (y - b.topY) / (b.botY - b.topY);
  const rawX = b.topRightX + tt * (b.botRightX - b.topRightX);
  return CX + (rawX - CX) * SCALE;
}

function fitaPath(b: BandGeo): string {
  const r = b.fitaR;
  return `M ${b.fitaX0} ${b.fitaY0} H ${b.fitaEndX - r} A ${r} ${r} 0 0 1 ${b.fitaEndX} ${b.fitaY0 + r} V ${b.fitaY1 - r} A ${r} ${r} 0 0 1 ${b.fitaEndX - r} ${b.fitaY1} H ${b.fitaX0} Z`;
}

function Funnel({ values, t, locale }: { values: [number, number, number, number]; t: T; locale: string }) {
  const gaps: number[] = [];
  for (let i = 0; i < BANDS.length - 1; i++) {
    gaps.push((BANDS[i].botY + (BANDS[i + 1].ellipseCy - BANDS[i + 1].ellipseRy)) / 2);
  }
  const LINE_TOP = 25;
  const lineYs = [LINE_TOP, gaps[1], gaps[2]];
  const bracketRanges = [
    { key: "top", y0: LINE_TOP, y1: gaps[1] },
    { key: "middle", y0: gaps[1] + 18, y1: gaps[2] },
    { key: "bottom", y0: gaps[2] + 18, y1: BANDS[3].botY + 16 },
  ];

  return (
    <section className="flex h-full flex-col rounded-[12px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-medium dark:text-slate-100">{t("funnel.title")}</h2>
      <div className="mt-2 flex flex-1 items-center justify-center">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full max-w-[560px]">
          {lineYs.map((y, i) => (
            <line
              key={i}
              x1={205}
              y1={y}
              x2={2310}
              y2={y}
              strokeWidth={6}
              strokeDasharray="30 31"
              className="stroke-[#10233F] dark:stroke-slate-300"
            />
          ))}
          {bracketRanges.map((g) => {
            const cy = (g.y0 + g.y1) / 2;
            return (
              <g key={g.key}>
                <path
                  d={`M 204 ${g.y0} H 164 V ${g.y1} H 204`}
                  fill="none"
                  strokeWidth={9}
                  className="stroke-[#10233F] dark:stroke-slate-300"
                />
                <text
                  x={78}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(-90 78 ${cy})`}
                  className="fill-[#10233F] dark:fill-slate-300"
                  style={{ fontSize: 52, fontWeight: 700 }}
                >
                  {t(`funnel.groups.${g.key}`)}
                </text>
              </g>
            );
          })}
          {BANDS.map((b, i) => {
            const val = values[i];
            const prev = i > 0 ? values[i - 1] : null;
            const conv = prev !== null && prev > 0 ? (val / prev) * 100 : null;
            const numY = b.topY + (b.botY - b.topY) * b.numWeight + 14;
            // tamanho da fonte calculado pro número final (não o que está contando), pra não "pular"
            const numStrFinal = integer(val, locale);
            const availWidth = 2 * (wallXAt(b, numY) - CX);
            const numFontSize = Math.min(120, (availWidth * 0.82) / (Math.max(1, numStrFinal.length) * 0.62));
            const startX = (wallXAt(b, b.fitaY0) + wallXAt(b, b.fitaY1)) / 2;
            const labelCx = (startX + b.fitaEndX) / 2;
            const midY = (b.fitaY0 + b.fitaY1) / 2;
            const labelCy = conv !== null ? midY - 29 : midY;
            return (
              <g key={STAGE_KEYS[i]}>
                <path d={fitaPath(b)} fill={b.fill} />
                <g transform={`translate(${CX},0) scale(${SCALE},1) translate(${-CX},0)`}>
                  <path d={b.corpo} fill={b.fill} />
                  <ellipse cx={CX} cy={b.ellipseCy} rx={b.ellipseRx} ry={b.ellipseRy} fill={b.rim} />
                </g>
                <text
                  x={CX}
                  y={numY}
                  fill="#FFFFFF"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: numFontSize, fontWeight: 800 }}
                >
                  <CountUp value={val} format={(x) => integer(x, locale)} />
                </text>
                <text
                  x={labelCx}
                  y={labelCy}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: 92, fontWeight: 600 }}
                >
                  {t(`funnel.stages.${STAGE_KEYS[i]}`)}
                </text>
                {conv !== null && (
                  <text
                    x={labelCx}
                    y={midY + 60}
                    fill="white"
                    opacity={0.85}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: 72 }}
                  >
                    {conv.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

/* ── De onde vieram as vendas (OriginsBlock) ─────────────────────────────── */

function Origins({
  data,
  started,
  t,
  fmt,
  period,
}: {
  data: RoiData;
  started: boolean;
  t: T;
  fmt: Fmt;
  period: RoiPeriod;
}) {
  const max = Math.max(1, ...data.origins.map((r) => r.count));
  const pct = (count: number) => (data.sales > 0 ? Math.round((count / data.sales) * 100) : 0);
  const coverage = data.sales > 0 ? Math.round((data.identified / data.sales) * 100) : 0;

  return (
    <section className="relative rounded-[12px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-medium dark:text-slate-100">{t("origins.title")}</h2>

      {/* anotação do mockup: aparece a cada troca de período */}
      <AnimatePresence mode="wait">
        {started && (
          <motion.span
            key={period}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.9, ease: EASE_OUT }}
            className="absolute right-4 top-4 flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-900 py-1 pl-1 pr-3 text-[12px] text-white shadow-[0_8px_22px_-8px_rgba(15,23,42,0.5)]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-[11px] text-brand-400">✓</span>
            <span className="font-semibold">{t("notes.origins")}</span>
          </motion.span>
        )}
      </AnimatePresence>

      <ul className="mt-4 space-y-3">
        {data.origins.map((r, i) => (
          <li key={r.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
              <span className="font-medium dark:text-slate-100">{t(`origins.labels.${r.key}`)}</span>
              <span className="tabular-nums text-slate-600 dark:text-slate-300">
                {t("origins.salesCount", { count: fmt.int(r.count) })} · {pct(r.count)}%
                <span className="text-slate-400 dark:text-slate-500"> · {fmt.money(r.revenueCents)}</span>
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={[
                  "h-2 rounded-full transition-[width] duration-700 ease-out",
                  r.key === "unknown" ? "bg-slate-300 dark:bg-slate-600" : "bg-brand-600 dark:bg-brand-400",
                ].join(" ")}
                style={{
                  width: started ? `${Math.max(2, (r.count / max) * 100)}%` : "0%",
                  transitionDelay: started ? `${i * 80}ms` : "0ms",
                }}
              />
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{t(`origins.hints.${r.key}`)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[8px] bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
        {t("origins.coverage", { identified: fmt.int(data.identified), total: fmt.int(data.sales), pct: coverage })}
      </div>
    </section>
  );
}
