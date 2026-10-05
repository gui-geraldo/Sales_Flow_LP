"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useAnimationControls, useInView, useReducedMotion } from "framer-motion";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { Logo } from "../Logo";
import { ExcelLogo, GoogleAdsLogo, MetaLogo, WhatsAppLogo } from "../BrandLogos";
import {
  BarChart3,
  BellRing,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Flame,
  Globe,
  MoonStar,
  type LucideIcon,
} from "lucide-react";

type Source = { label: string; lost: string; gain: string };
type Output = { title: string; detail: string };
type Mode = "without" | "with";
type Point = { x: number; y: number; r?: number };
type Layout = {
  w: number;
  h: number;
  center: Point;
  // posição de cada fonte com Sales Flow (organizada em volta do centro)
  with: Point[];
  // sem Sales Flow: espalhada e torta, com o fio indo pra fora
  without: Point[];
  // esteira dos entregáveis: descem de "from" até "to" na coluna x
  stream: { x: number; from: number; to: number };
};

// Mesma ordem do es.json: WhatsApp, Meta Ads, Formulário web, Google Ads,
// Excel, Tu sitio web. Formulário e site não são marca: ícones genéricos.
function FormLogo({ className }: { className?: string }) {
  return <ClipboardList className={`${className} text-gray-700`} strokeWidth={2} aria-hidden="true" />;
}
function WebLogo({ className }: { className?: string }) {
  return <Globe className={`${className} text-gray-700`} strokeWidth={2} aria-hidden="true" />;
}
const LOGOS: ComponentType<{ className?: string }>[] = [
  WhatsAppLogo,
  MetaLogo,
  FormLogo,
  GoogleAdsLogo,
  ExcelLogo,
  WebLogo,
];
// Mesma ordem dos "outputs" do es.json.
const OUTPUT_ICONS: LucideIcon[] = [CalendarCheck, CalendarClock, Flame, BarChart3, MoonStar, BellRing];

const DESKTOP: Layout = {
  w: 800,
  h: 560,
  center: { x: 400, y: 175 },
  with: [
    { x: 605, y: 180 },
    { x: 220, y: 65 },
    { x: 195, y: 180 },
    { x: 190, y: 295 },
    { x: 610, y: 295 },
    { x: 585, y: 65 },
  ],
  without: [
    { x: 640, y: 210, r: 5 },
    { x: 195, y: 45, r: -6 },
    { x: 255, y: 160, r: 4 },
    { x: 180, y: 310, r: 3 },
    { x: 555, y: 325, r: -4 },
    { x: 600, y: 40, r: -5 },
  ],
  stream: { x: 400, from: 275, to: 540 },
};

const MOBILE: Layout = {
  w: 360,
  h: 700,
  center: { x: 180, y: 160 },
  with: [
    { x: 290, y: 160 },
    { x: 85, y: 45 },
    { x: 70, y: 160 },
    { x: 85, y: 270 },
    { x: 275, y: 270 },
    { x: 275, y: 45 },
  ],
  without: [
    { x: 280, y: 190, r: -4 },
    { x: 75, y: 55, r: -6 },
    { x: 110, y: 165, r: 4 },
    { x: 90, y: 280, r: 3 },
    { x: 250, y: 295, r: -5 },
    { x: 265, y: 38, r: 5 },
  ],
  stream: { x: 180, from: 350, to: 685 },
};

const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 } as const;
// Na virada pra "com": mola mais solta, os cartões "estalam" no lugar.
const SNAP = { type: "spring", stiffness: 210, damping: 13, mass: 0.8 } as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Virada automática: o gatilho dispara um pouco ANTES do logo do centro
// entrar na tela (margem positiva embaixo), avisa (chave "Con" e círculo
// vazio pulsando) por CUE_MS e vira, então a virada cai quando o logo aparece.
const CUE_START = 0;
const CUE_MS = 600;

// Esteira: sai um entregável a cada EMIT_EVERY ms e cada um leva LIFETIME s
// pra descer e sumir. Como a descida é linear, a distância entre dois cartões
// é sempre percurso × EMIT_EVERY / LIFETIME: com 2 s / 5 s dá 40% do percurso
// (no mínimo ~93 px, no tablet de 768 px; ~120 px no desktop e no celular),
// acima da altura do cartão (~58 px, sempre uma linha de título e uma de
// detalhe, sem quebra), então eles nunca se encostam. Se mudar
// o intervalo, o tempo de vida ou o percurso, refazer essa conta.
// VISIBLE só diz quantos ficam montados; tem que cobrir LIFETIME.
const EMIT_EVERY = 2000;
const LIFETIME = 5;
const VISIBLE = Math.ceil((LIFETIME * 1000) / EMIT_EVERY);
const FLOW_DUR = 2.4;

// Curva levemente arqueada de a até b (o arco dá a sensação de "fluxo",
// linha reta parece diagrama técnico).
function curve(a: Point, b: Point, bend = 0.18) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

// Fio "perdido" (sem Sales Flow): sai da fonte pra longe do centro, sem
// destino, preso dentro do palco.
function lostTail(p: Point, center: Point, w: number, h: number, i: number) {
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  const end = {
    x: Math.min(w - 12, Math.max(12, p.x + (dx / len) * 70)),
    y: Math.min(h - 12, Math.max(12, p.y + (dy / len) * 70 + 25)),
  };
  return curve(p, end, i % 2 ? 0.3 : -0.3);
}

function pct(v: number, total: number) {
  return `${(v / total) * 100}%`;
}

// Ponto verde correndo pelo fio, em loop.
function Particle({ d, begin, r, dur = FLOW_DUR }: { d: string; begin: number; r: number; dur?: number }) {
  return (
    <circle r={r} fill="rgb(74 222 128)" opacity={0}>
      <animateMotion
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        path={d}
        keyPoints="0;1"
        keyTimes="0;1"
        calcMode="spline"
        keySplines="0.4 0 0.6 1"
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.15;0.8;1"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

function Stage({
  layout,
  mode,
  sources,
  outputs,
  ticks,
  caption,
  reduce,
  compact,
  cue,
  onReach,
}: {
  layout: Layout;
  mode: Mode;
  sources: Source[];
  outputs: Output[];
  ticks: number[];
  caption: string;
  reduce: boolean;
  compact: boolean;
  cue: boolean;
  onReach: () => void;
}) {
  const isWith = mode === "with";
  const { w, h, center, stream } = layout;

  // Gatilho da virada: o ponto do logo chegando a 20% da altura da tela
  // abaixo da borda de baixo, ou seja, antes de ele aparecer. O palco
  // escondido (desktop ou celular) nunca dispara.
  const centerRef = useRef<HTMLDivElement>(null);
  const reached = useInView(centerRef, { once: true, margin: "0px 0px 20% 0px" });
  useEffect(() => {
    if (reached) onReach();
  }, [reached, onReach]);
  const streamPath = `M ${center.x} ${center.y} L ${stream.x} ${stream.to}`;

  // O logo "pisca" junto com cada entregável que nasce (mesmo contador).
  const latest = ticks.length ? ticks[ticks.length - 1] : -1;
  const beat = useAnimationControls();
  useEffect(() => {
    if (latest < 0 || reduce) return;
    beat.start({ scale: [1, 1.12, 1], transition: { duration: 0.5, ease: EASE_OUT } });
  }, [latest, reduce, beat]);

  const ringR = compact ? 34 : 44;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${compact ? "m" : "d"}`}>
            <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity="0" />
          </radialGradient>
          {/* a esteira vai sumindo embaixo */}
          <linearGradient id={`stream-${compact ? "m" : "d"}`} x1="0" y1={center.y} x2="0" y2={stream.to} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* brilho atrás do centro */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={compact ? 120 : 170}
          fill={`url(#glow-${compact ? "m" : "d"})`}
          initial={false}
          animate={{ opacity: isWith ? 1 : 0, scale: isWith ? (reduce ? 1 : [0.6, 1.35, 1]) : 0.6 }}
          transition={{ duration: isWith ? 1.1 : 0.5, ease: EASE_OUT }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        />

        {/* virada pra "com": duas ondas saindo do centro, uma vez só */}
        {isWith &&
          !reduce &&
          [0, 0.18].map((delay) => (
            <motion.circle
              key={`wave-${delay}`}
              cx={center.x}
              cy={center.y}
              fill="none"
              stroke="rgb(74 222 128)"
              strokeWidth={2}
              initial={{ r: ringR, opacity: 0.8 }}
              animate={{ r: compact ? 190 : 320, opacity: 0 }}
              transition={{ duration: 1.1, delay, ease: EASE_OUT }}
            />
          ))}

        {/* sem Sales Flow: cada fio vai pra um lado, tracejado e sem destino.
            Sem pathLength aqui: o framer usa o stroke-dasharray pra desenhar a
            linha e apagaria o tracejado. */}
        {sources.map((s, i) => (
          <motion.path
            key={`lost-${s.label}`}
            d={lostTail(layout.without[i], center, w, h, i)}
            fill="none"
            stroke="rgb(107 114 128)"
            strokeWidth={1.5}
            strokeDasharray="4 6"
            strokeLinecap="round"
            initial={false}
            animate={{
              opacity: isWith ? 0 : 0.7,
              strokeDashoffset: reduce || isWith ? 0 : [0, -40],
            }}
            transition={{
              opacity: { duration: 0.35 },
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
          />
        ))}

        {/* com Sales Flow: todos os fios chegam no centro */}
        {sources.map((s, i) => {
          const d = curve(layout.with[i], center, i % 2 ? 0.12 : -0.12);
          return (
            <g key={`flow-${s.label}`}>
              <motion.path
                d={d}
                fill="none"
                stroke="rgb(34 197 94)"
                strokeOpacity={0.45}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: isWith ? 1 : 0, opacity: isWith ? 1 : 0 }}
                transition={{ duration: 0.7, delay: isWith ? 0.1 + i * 0.05 : 0, ease: EASE_OUT }}
              />
              {isWith && !reduce && (
                <>
                  <Particle d={d} begin={0.3 + i * 0.15} r={compact ? 2.5 : 3} />
                  <Particle d={d} begin={0.3 + i * 0.15 + FLOW_DUR / 2} r={compact ? 2.5 : 3} />
                </>
              )}
            </g>
          );
        })}

        {/* esteira: fio descendo do centro, some embaixo */}
        <motion.path
          d={streamPath}
          fill="none"
          stroke={`url(#stream-${compact ? "m" : "d"})`}
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: isWith ? 1 : 0, opacity: isWith ? 1 : 0 }}
          transition={{ duration: 0.8, delay: isWith ? 0.4 : 0, ease: EASE_OUT }}
        />
        {isWith && !reduce && (
          <>
            <Particle d={streamPath} begin={0.6} r={compact ? 2.5 : 3} dur={3} />
            <Particle d={streamPath} begin={2.1} r={compact ? 2.5 : 3} dur={3} />
          </>
        )}

        {/* sem Sales Flow: um círculo vazio onde deveria estar o lugar comum */}
        {/* durante o aviso ele pulsa em verde: "algo vai acontecer aqui" */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={ringR}
          fill="none"
          strokeWidth={cue ? 2 : 1.5}
          strokeDasharray="3 6"
          initial={false}
          animate={{
            opacity: isWith ? 0 : cue ? 1 : 0.8,
            stroke: cue ? "rgb(74 222 128)" : "rgb(75 85 99)",
            scale: cue && !reduce ? [1, 1.18, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.3 },
            stroke: { duration: 0.3 },
            scale: cue ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
          }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        />
      </svg>

      {/* entregáveis: cada um nasce embaixo do centro, desce e some */}
      <AnimatePresence>
        {isWith &&
          ticks.map((tick) => {
            const o = outputs[tick % outputs.length];
            const Icon = OUTPUT_ICONS[tick % OUTPUT_ICONS.length];
            const mid = (stream.from + stream.to) / 2;
            return (
              <motion.div
                key={tick}
                // Texto numa linha só (whitespace-nowrap) e largura pelo
                // conteúdo: todo cartão tem a mesma altura (~58 px) em
                // qualquer tela, e a conta do espaçamento (EMIT_EVERY) vale.
                className="absolute w-max whitespace-nowrap"
                style={{ left: pct(stream.x, w), x: "-50%", y: "-50%" }}
                initial={{ top: pct(reduce ? mid : stream.from, h), opacity: 0, scale: 0.9 }}
                animate={
                  reduce
                    ? { opacity: 1, scale: 1 }
                    : {
                        top: [pct(stream.from, h), pct(stream.to, h)],
                        opacity: [0, 1, 1, 0],
                        scale: [0.9, 1, 1, 0.96],
                      }
                }
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={
                  reduce
                    ? { duration: 0.4 }
                    : {
                        top: { duration: LIFETIME, ease: "linear" },
                        opacity: { duration: LIFETIME, times: [0, 0.08, 0.72, 1], ease: "linear" },
                        scale: { duration: LIFETIME, times: [0, 0.08, 0.72, 1], ease: "easeOut" },
                      }
                }
              >
                <div className="flex items-center gap-3 rounded-xl border border-brand-500/30 bg-gray-900 px-3 py-2.5 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.8)]">
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400 ${
                      compact ? "h-8 w-8" : "h-9 w-9"
                    }`}
                  >
                    <Icon size={compact ? 16 : 18} strokeWidth={2} />
                  </span>
                  <span className="min-w-0 text-left">
                    <span
                      className={`block font-semibold leading-snug text-white ${compact ? "text-[13px]" : "text-sm"}`}
                    >
                      {o.title}
                    </span>
                    <span className={`mt-0.5 block leading-snug text-gray-400 ${compact ? "text-[11px]" : "text-xs"}`}>
                      {o.detail}
                    </span>
                  </span>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      <div
        ref={centerRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px"
        style={{ left: pct(center.x, w), top: pct(center.y, h) }}
      />

      {/* centro: Sales Flow */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ left: pct(center.x, w), top: pct(center.y, h), x: "-50%", y: "-50%" }}
        initial={false}
        animate={{ opacity: isWith ? 1 : 0, scale: isWith ? 1 : 0.5 }}
        transition={isWith ? { ...SNAP, delay: 0.05 } : { duration: 0.25 }}
      >
        <div className="relative flex items-center justify-center">
          {/* pulso que sai do logo a cada entregável (mesmo ritmo da esteira) */}
          <AnimatePresence>
            {isWith && !reduce && latest >= 0 && (
              <motion.span
                key={latest}
                className="absolute inset-0 rounded-full bg-brand-500/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.9, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              />
            )}
          </AnimatePresence>
          <motion.div
            animate={beat}
            className={`relative flex items-center justify-center rounded-full border border-brand-500/40 bg-gray-900 shadow-[0_0_40px_-6px_rgba(34,197,94,0.55)] ${
              compact ? "h-16 w-16" : "h-20 w-20"
            }`}
          >
            {/* logo quase do tamanho do círculo, só um aro escuro fino */}
            <Logo size={compact ? 56 : 72} />
          </motion.div>
        </div>
        <p className={`mt-2 font-semibold text-white ${compact ? "text-sm" : "text-[15px]"}`}>Sales Flow</p>
        <p className="text-xs text-brand-400">{caption}</p>
      </motion.div>

      {/* fontes */}
      {sources.map((s, i) => {
        const p = isWith ? layout.with[i] : layout.without[i];
        const BrandLogo = LOGOS[i];
        return (
          <motion.div
            key={s.label}
            className="absolute"
            style={{ x: "-50%", y: "-50%" }}
            initial={false}
            animate={{ left: pct(p.x, w), top: pct(p.y, h), rotate: isWith ? 0 : p.r ?? 0 }}
            transition={reduce ? { duration: 0 } : isWith ? { ...SNAP, delay: i * 0.04 } : { ...SPRING, delay: (5 - i) * 0.04 }}
          >
            <div
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg border bg-gray-900 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)] transition-colors duration-500 ${
                compact ? "px-2 py-1.5" : "px-3 py-2"
              } ${isWith ? "border-brand-500/30" : "border-white/10"}`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-md bg-white ${
                  compact ? "h-6 w-6" : "h-8 w-8"
                }`}
              >
                <BrandLogo className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </span>
              <span className={`font-medium text-white ${compact ? "text-xs" : "text-sm"}`}>{s.label}</span>
            </div>
            <div className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25, delay: isWith ? 0.35 + i * 0.05 : 0.05 }}
                  className={`rounded bg-gray-950/85 px-1.5 ${compact ? "text-[10.5px]" : "text-xs"} ${
                    isWith ? "text-brand-400" : "text-gray-500"
                  }`}
                >
                  {isWith ? s.gain : s.lost}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// "Sem Sales Flow / Com Sales Flow": as fontes de contato da clínica (anúncios,
// formulário, site, WhatsApp, Excel) primeiro cada uma pro seu lado, depois
// todas fluindo pro mesmo painel, e dele saindo uma esteira de entregáveis
// (cita, follow-up, relatório...) que descem e somem, um a cada 2 s.
// Começa em "sem" e vira "com" logo que a seção entra na tela (só um relance
// do "sem", pra ter o contraste); se a pessoa clicar na chave, o automático para.
export function ClinicEcosystem({
  initialMode = "without",
  namespace = "clinic.ecosystem",
}: {
  initialMode?: Mode;
  // es/en: variante de clínica; pt: textos genéricos em "ecosystem".
  namespace?: "clinic.ecosystem" | "ecosystem";
}) {
  const t = useTranslations(namespace);
  const sources = t.raw("sources") as Source[];
  const outputs = t.raw("outputs") as Output[];
  const reduce = useReducedMotion() ?? false;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [touched, setTouched] = useState(initialMode === "with");
  const [cue, setCue] = useState(false);
  const [inView, setInView] = useState(false);
  const onReach = useCallback(() => setInView(true), []);

  // Entrou na tela: um instante de "sem", depois o aviso (chave "Con" e
  // centro pulsando) e só então a virada. Com reduced motion, vira direto.
  useEffect(() => {
    if (!inView || touched) return;
    if (reduce) {
      const id = window.setTimeout(() => setMode("with"), CUE_START);
      return () => window.clearTimeout(id);
    }
    const cueId = window.setTimeout(() => setCue(true), CUE_START);
    const flipId = window.setTimeout(() => {
      setCue(false);
      setMode("with");
    }, CUE_START + CUE_MS);
    return () => {
      window.clearTimeout(cueId);
      window.clearTimeout(flipId);
      setCue(false);
    };
  }, [inView, touched, reduce]);

  // Contador da esteira: -1 = nada ainda. O primeiro entregável sai logo
  // depois que os fios chegam no centro; depois um a cada EMIT_EVERY.
  const [tick, setTick] = useState(-1);
  useEffect(() => {
    if (mode !== "with") {
      setTick(-1);
      return;
    }
    let interval: number | undefined;
    const first = window.setTimeout(() => {
      setTick((n) => n + 1);
      interval = window.setInterval(() => setTick((n) => n + 1), EMIT_EVERY);
    }, 900);
    return () => {
      window.clearTimeout(first);
      if (interval) window.clearInterval(interval);
    };
  }, [mode]);

  // Cartões vivos: os últimos VISIBLE (só o atual com reduced motion).
  const ticks: number[] = [];
  for (let k = Math.max(0, tick - (reduce ? 0 : VISIBLE - 1)); k <= tick; k++) ticks.push(k);

  const choose = (m: Mode) => {
    setTouched(true);
    setMode(m);
  };

  const caption = t("centerCaption");

  return (
    <section id="ecosistema" className="overflow-hidden border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center md:max-w-none">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">{t("eyebrow")}</p>
          {/* No computador, o título inteiro numa linha só. */}
          <h2 className="mt-3 text-3xl font-bold leading-snug tracking-[-0.02em] text-white md:text-4xl lg:whitespace-nowrap lg:text-[32px] xl:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <div role="group" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {(["without", "with"] as const).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(m)}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    active ? (m === "with" ? "text-white" : "text-gray-200") : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="ecosystem-toggle"
                      className={`absolute inset-0 rounded-full ${m === "with" ? "bg-brand-600" : "bg-white/10"}`}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {/* aviso antes da virada: a chave "Con" pulsa em verde */}
                  {m === "with" && cue && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-brand-400"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0.9, 0], scale: [1, 1.35] }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <span className={`relative transition-colors duration-200 ${m === "with" && cue ? "text-brand-400" : ""}`}>
                    {m === "with" ? t("toggleWith") : t("toggleWithout")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <div className="hidden md:block">
            <Stage
              layout={DESKTOP}
              mode={mode}
              sources={sources}
              outputs={outputs}
              ticks={ticks}
              caption={caption}
              reduce={reduce}
              compact={false}
              cue={cue}
              onReach={onReach}
            />
          </div>
          <div className="md:hidden">
            <Stage
              layout={MOBILE}
              mode={mode}
              sources={sources}
              outputs={outputs}
              ticks={ticks}
              caption={caption}
              reduce={reduce}
              compact
              cue={cue}
              onReach={onReach}
            />
          </div>
        </div>

        <div className="mt-6 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={`text-[15px] ${mode === "with" ? "text-gray-200" : "text-gray-500"}`}
            >
              {mode === "with" ? t("captionWith") : t("captionWithout")}
            </motion.p>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
