import { Logo } from "@/components/Logo";

// Material para a Pamela (revendedora) mostrar às clínicas dela, em espanhol
// neutro (Peru primeiro, depois Espanha). Conteúdo: vault comercial,
// "Material - Sales Flow para clinicas (revenda, ES)". Mesmo molde da
// apresentação das escolas de dança (DanceSlides): cada slide é uma folha A4
// deitada a 96 dpi (1123 x 794) e vira uma página no @media print.
//
// As telas são réplicas estáticas da plataforma (auto_agendador, apps/web),
// com os rótulos do es.json dela (Conversaciones, No leídas, Asignado a:,
// Asistente de IA, Resultados, Revisar y enviar...). Nomes, horários, valores
// e conversas são fictícios; nenhum nome de cliente real.
//
// Regras do material: SEM preço dos planos (a Pamela define); só o valor de
// automação e envio (€ 0.02, como na nota da parceria; números no formato do
// Peru: 5,000 e S/ 24,600). Sem emoji, sem
// travessão, título sem ponto, nada de "CRM", "API", "lead", "pipeline",
// "omnicanal" (exceção: "número oficial de WhatsApp"). Espanhol neutro, sem
// "vale" nem "vosotros"; "usted" com o paciente.

const W = 1123;
const H = 794;

export function ClinicSlides() {
  return (
    <div className="slides flex flex-col items-center gap-10 py-10">
      <SlideCover />
      <SlideProblem />
      <SlideAssistant />
      <SlideAgenda />
      <SlideTeam />
      <SlideResults />
      <SlideBroadcast />
      <SlideConnect />
      <SlidePlans />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Estrutura comum (igual à DanceSlides)                                     */
/* ------------------------------------------------------------------------ */

function Slide({ children, glow = "78% 45%" }: { children: React.ReactNode; glow?: string }) {
  return (
    <section
      className="slide relative shrink-0 overflow-hidden bg-gray-950 font-sans text-white"
      style={{ width: W, height: H }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(55% 70% at ${glow}, rgba(22,163,74,0.14), transparent 70%)` }}
      />
      <header className="absolute left-[56px] top-[28px] z-10 flex items-center gap-2.5">
        <Logo size={28} />
        <span className="text-[18px] font-semibold tracking-tight">Sales Flow</span>
      </header>
      {children}
    </section>
  );
}

const AREA_TOP = 76;
const AREA_BOTTOM = H - 28;
/** `top` que centraliza um bloco de altura `h` na área útil. */
const vCenter = (h: number) => AREA_TOP + (AREA_BOTTOM - AREA_TOP - h) / 2;

function TextColumn({ width = 420, children }: { width?: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute left-[56px] flex flex-col justify-center"
      style={{ width, top: AREA_TOP, bottom: H - AREA_BOTTOM }}
    >
      {children}
    </div>
  );
}

function Title({ children, size = 50 }: { children: React.ReactNode; size?: number }) {
  return (
    <h2 className="font-semibold leading-[1.06] tracking-[-0.025em]" style={{ fontSize: size }}>
      {children}
    </h2>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex w-fit rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-[15px] font-medium text-brand-300">
      {children}
    </p>
  );
}

/** Tópicos; `compact` para slides com 5 tópicos (cabe sem encolher a tela). */
function Bullets({ items, compact = false }: { items: React.ReactNode[]; compact?: boolean }) {
  return (
    <ul className={compact ? "mt-7 space-y-3.5" : "mt-9 space-y-5"}>
      {items.map((item, i) => (
        <li
          key={i}
          className={["flex gap-3.5 text-gray-300", compact ? "text-[20px] leading-[1.3]" : "text-[25px] leading-[1.32]"].join(" ")}
        >
          <span
            className={["shrink-0 rounded-full bg-brand-500", compact ? "mt-[10px] h-2 w-2" : "mt-[12px] h-2.5 w-2.5"].join(" ")}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Tela da plataforma desenhada com `designW` px e ampliada até `width`. */
function Screen({
  designW,
  designH,
  width,
  className,
  style,
  children,
}: {
  designW: number;
  designH: number;
  width: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const scale = width / designW;
  return (
    <div className={className} style={{ width, height: designH * scale, ...style }}>
      <div
        className="font-sans text-slate-900"
        style={{ width: designW, height: designH, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

const SCREEN_SHADOW = "shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)]";

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

function ContactAvatar({ name, tone = "slate" }: { name: string; tone?: "slate" | "brand" }) {
  return (
    <span
      className={[
        "flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold",
        tone === "brand" ? "bg-brand-100 text-brand-800" : "bg-slate-300 text-slate-700",
      ].join(" ")}
    >
      {initials(name)}
    </span>
  );
}

function AiAvatar() {
  // eslint-disable-next-line @next/next/no-img-element -- arquivo estático em public/
  return <img src="/mockup/ai-avatar.png" alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />;
}

/* ------------------------------------------------------------------------ */
/* Canais                                                                    */
/* ------------------------------------------------------------------------ */

type Channel = "whatsapp" | "instagram" | "facebook";
const CHANNEL_LABEL: Record<Channel, string> = { whatsapp: "WhatsApp", instagram: "Instagram", facebook: "Facebook" };

function ChannelIcon({ channel, size = 14 }: { channel: Channel; size?: number }) {
  if (channel === "whatsapp") {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" width={size * 0.66} height={size * 0.66} fill="currentColor">
          <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.6 12.5c-.2.6-1.1 1.1-1.6 1.1-.4 0-.9.2-3-.6-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.2 1.3Z" />
        </svg>
      </span>
    );
  }
  if (channel === "instagram") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-[30%] text-white"
        style={{ width: size, height: size, background: "linear-gradient(45deg,#f9a825,#e91e63 55%,#7b1fa2)" }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" stroke="currentColor" strokeWidth={2.4}>
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="currentColor">
        <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.6-4h-3.1V9c0-.6.4-1 1-1Z" />
      </svg>
    </span>
  );
}

// Laço "infinito" da Meta: lemniscata suave calculada (laços mais altos que
// largos, como no símbolo), em vez de curva desenhada à mão.
const META_LOOP = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;
    const x = 32 + (26 * Math.cos(t)) / d;
    const y = 18 + (26 * Math.sin(t) * Math.cos(t) * 1.45) / d;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

/** Só o símbolo da Meta, com `height` px de altura. */
function MetaGlyph({ height }: { height: number }) {
  return (
    <svg viewBox="0 0 64 36" height={height} width={(height * 64) / 36} aria-hidden className="shrink-0">
      <path d={META_LOOP} fill="none" stroke="#0573F0" strokeWidth={6.5} strokeLinejoin="round" />
    </svg>
  );
}

/** "G" colorido do Google. */
function GoogleGlyph({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Selo da Meta: símbolo + nome, em pílula branca. */
function MetaIcon({ height = 34 }: { height?: number }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full bg-white pl-2.5 pr-3.5"
      style={{ height }}
      aria-label="Meta"
    >
      <MetaGlyph height={height * 0.62} />
      <span className="text-[17px] font-semibold tracking-tight text-[#1c2b33]">Meta</span>
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Conversa (painel da /inbox)                                               */
/* ------------------------------------------------------------------------ */

type ChatItem =
  | { kind: "date"; text: string }
  | { kind: "msg"; dir: "in"; text: string; time: string }
  | { kind: "audio"; duration: string; time: string }
  | { kind: "msg"; dir: "out"; by: "ai" | string; text: string; time: string }
  | { kind: "note"; title: string; body: string };

function ChatPanel({
  contact,
  channel = "whatsapp",
  items,
  ai,
  assignee,
  assigneeMenu,
  className,
}: {
  contact: string;
  channel?: Channel;
  items: ChatItem[];
  ai: boolean;
  assignee?: string;
  /** Lista de pessoas do seletor "Asignado a:", aberto por cima da conversa. */
  assigneeMenu?: string[];
  className?: string;
}) {
  let prevKey: string | null = null;
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm ${className ?? ""}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 px-1 py-0.5">
          <ContactAvatar name={contact} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium leading-tight">{contact}</div>
            <div className="flex items-center gap-1 truncate text-[11px] uppercase text-slate-400">
              <ChannelIcon channel={channel} size={11} />
              {CHANNEL_LABEL[channel]}
              {!assignee && " · Recepción"}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {assignee && (
            <span
              className={[
                "flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-xs text-slate-600",
                assigneeMenu ? "border-brand-500 ring-2 ring-brand-500/20" : "border-slate-200",
              ].join(" ")}
            >
              <span className="text-slate-400">Asignado a:</span>
              <span className="font-medium text-slate-800">{assignee}</span>
              {assigneeMenu && (
                <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.4} className="text-slate-400">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </span>
          )}
          {ai ? (
            <span className="flex items-center gap-2 rounded-full border border-green-600 bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              IA activa
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              IA desactivada
            </span>
          )}
        </div>
      </header>

      {assigneeMenu && (
        <div className="absolute right-[118px] top-[46px] z-10 w-[170px] overflow-hidden rounded-[10px] border border-slate-200 bg-white py-1 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.35)]">
          <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase text-slate-400">Responsable</p>
          {assigneeMenu.map((person) => {
            const selected = person === assignee;
            return (
              <div
                key={person}
                className={["flex items-center gap-2 px-3 py-1.5 text-[13px]", selected ? "bg-brand-50 font-medium text-brand-800" : "text-slate-700"].join(" ")}
              >
                {person === "Nadie" ? (
                  <span className="h-6 w-6 shrink-0 rounded-full border border-dashed border-slate-300" />
                ) : (
                  <span className="scale-[0.86]">
                    <ContactAvatar name={person} tone={selected ? "brand" : "slate"} />
                  </span>
                )}
                <span className="flex-1">{person}</span>
                {selected && <span className="text-brand-600">✓</span>}
              </div>
            );
          })}
        </div>
      )}

      <div className="mock-chat-bg flex min-h-0 flex-1 flex-col px-4 py-3">
        <div className="space-y-1">
          {items.map((item, i) => {
            if (item.kind === "date") {
              prevKey = null;
              return (
                <div key={i} className="flex justify-center py-1.5">
                  <span className="rounded-[8px] bg-white/80 px-3 py-1 text-[11px] text-slate-500 shadow-sm">{item.text}</span>
                </div>
              );
            }
            if (item.kind === "note") {
              return (
                <div key={i} className="flex justify-center py-1">
                  <span className="flex max-w-full items-center gap-2 rounded-[14px] bg-slate-900 py-1 pl-1 pr-3 text-[12px] leading-snug text-white shadow-[0_8px_22px_-8px_rgba(15,23,42,0.5)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[11px] text-brand-400">
                      ✓
                    </span>
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-slate-300"> {item.body}</span>
                    </span>
                  </span>
                </div>
              );
            }
            const mine = item.kind === "msg" && item.dir === "out";
            const key = item.kind === "msg" && item.dir === "out" ? `out-${item.by}` : "in";
            const startsGroup = prevKey !== key;
            prevKey = key;
            const author = item.kind === "msg" && item.dir === "out" ? item.by : null;
            return (
              <div
                key={i}
                className={["flex min-w-0 items-end gap-2", mine ? "justify-end" : "justify-start", startsGroup ? "mt-2" : ""].join(" ")}
              >
                {!mine && (startsGroup ? <ContactAvatar name={contact} /> : <span className="w-7 shrink-0" />)}
                <div
                  className={[
                    "relative min-w-0 max-w-[78%] rounded-[8px] px-2.5 py-1.5 text-sm text-slate-800 shadow-sm",
                    mine ? "bg-[#d9fdd3]" : "bg-white",
                    startsGroup && mine ? "rounded-tr-none" : "",
                    startsGroup && !mine ? "rounded-tl-none" : "",
                  ].join(" ")}
                >
                  {author && author !== "ai" && startsGroup && (
                    <span className="block text-[11px] font-semibold text-brand-700">{author}</span>
                  )}
                  {item.kind === "audio" ? (
                    <AudioBubble duration={item.duration} />
                  ) : (
                    <span className="whitespace-pre-wrap break-words">{item.text}</span>
                  )}
                  <span className="ml-2 inline-block translate-y-0.5 whitespace-nowrap text-[10px] text-slate-400">
                    {item.time}
                    {mine && <span className="ml-1 text-[10px] text-sky-500">✓✓</span>}
                  </span>
                </div>
                {mine &&
                  (!startsGroup ? (
                    <span className="w-7 shrink-0" />
                  ) : author === "ai" ? (
                    <AiAvatar />
                  ) : (
                    <ContactAvatar name={author ?? ""} tone="brand" />
                  ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        <span className="flex min-h-[2.25rem] flex-1 items-center rounded-2xl border border-slate-200 px-4 py-1.5 text-sm text-slate-400 shadow-sm">
          Escribe un mensaje…
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/** Mensagem de voz: play, onda e duração (o paciente mandou um audio). */
function AudioBubble({ duration }: { duration: string }) {
  const bars = [6, 10, 14, 8, 16, 12, 18, 9, 13, 7, 15, 11, 17, 8, 12, 6, 10, 14, 9, 5];
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
        <svg viewBox="0 0 24 24" width={11} height={11} fill="currentColor">
          <path d="M7 4v16l13-8z" />
        </svg>
      </span>
      <span className="flex h-5 items-center gap-[2px]">
        {bars.map((h, i) => (
          <span key={i} className={`w-[3px] rounded-full ${i < 7 ? "bg-brand-600" : "bg-slate-300"}`} style={{ height: h }} />
        ))}
      </span>
      <span className="text-[11px] text-slate-500">{duration}</span>
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Lista de conversas                                                        */
/* ------------------------------------------------------------------------ */

type Temperature = "cold" | "warm" | "hot";
const TEMPERATURE: Record<Temperature, { label: string; cls: string }> = {
  cold: { label: "Frío", cls: "bg-sky-100 text-sky-700" },
  warm: { label: "Tibio", cls: "bg-amber-100 text-amber-700" },
  hot: { label: "Caliente", cls: "bg-red-100 text-red-700" },
};

type Row = {
  name: string;
  channel: Channel;
  preview: string;
  time: string;
  out?: boolean;
  unread?: number;
  active?: boolean;
  temperature?: Temperature;
  tag?: { text: string; color: string };
  assignee?: string;
};

function ConversationList({ rows, filter = "Todas", width = 250 }: { rows: Row[]; filter?: "Todas" | "No leídas"; width?: number }) {
  return (
    <div className="flex shrink-0 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm" style={{ width }}>
      <div className="space-y-1.5 border-b border-slate-200 p-1.5">
        <span className="flex items-center justify-between rounded-[6px] border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
          Todas las bandejas (3)
          <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} className="text-slate-400">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
        <div className="flex gap-1">
          {(["Todas", "Mías", "No leídas"] as const).map((tab) => (
            <span
              key={tab}
              className={[
                "rounded-full px-2 py-0.5 text-[11px]",
                tab === filter ? "bg-brand-600 font-medium text-white" : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      <ul className="divide-y divide-slate-100">
        {rows.map((row) => (
          <li
            key={row.name}
            className={[
              "flex items-center gap-2.5 px-2.5 py-2",
              row.active ? "bg-brand-50" : row.unread ? "bg-emerald-50/70" : "bg-white",
            ].join(" ")}
          >
            <span className="relative">
              <ContactAvatar name={row.name} />
              <span className="absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-white">
                <ChannelIcon channel={row.channel} size={12} />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className={`block min-w-0 truncate text-sm ${row.unread ? "font-bold" : "font-medium text-slate-700"}`}>
                  {row.name}
                </span>
                {row.assignee && (
                  <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {row.assignee}
                  </span>
                )}
              </span>
              <span className={`block truncate text-xs ${row.unread ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                {row.out && "↩ "}
                {row.preview}
              </span>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span className="flex min-w-0 items-center gap-1">
                  {row.tag && (
                    <span className="truncate rounded-full px-1.5 py-0.5 text-[10px] text-slate-800" style={{ backgroundColor: row.tag.color }}>
                      {row.tag.text}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {row.temperature && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TEMPERATURE[row.temperature].cls}`}>
                      {TEMPERATURE[row.temperature].label}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">{row.time}</span>
                  {row.unread ? (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
                      {row.unread}
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 1: capa                                                            */
/* ------------------------------------------------------------------------ */

const COVER_ROWS: Row[] = [
  { name: "Lucía Ramos", channel: "whatsapp", preview: "Le paso los horarios libres", time: "22:41", out: true, active: true, temperature: "hot", tag: { text: "Limpieza facial", color: "#fde68a" } },
  { name: "Andrea Vega", channel: "instagram", preview: "Vi su publicación del peeling", time: "22:30", unread: 2, temperature: "warm" },
  { name: "Carlos Mendoza", channel: "whatsapp", preview: "¿Atienden los sábados?", time: "21:58", unread: 1, temperature: "cold" },
  { name: "Valeria Soto", channel: "whatsapp", preview: "Su cita quedó para el jueves", time: "21:15", out: true, temperature: "hot", tag: { text: "Evaluación", color: "#a7f3d0" } },
  { name: "Diego Paredes", channel: "instagram", preview: "¿Cuánto cuesta el botox?", time: "20:47", temperature: "warm", assignee: "Marina" },
  { name: "Rosa Quispe", channel: "whatsapp", preview: "Gracias, nos vemos mañana", time: "Ayer", temperature: "warm" },
  { name: "Mariana Díaz", channel: "instagram", preview: "¿Dónde están ubicados?", time: "Ayer", temperature: "cold", assignee: "Paulo" },
  { name: "Javier Torres", channel: "whatsapp", preview: "Quiero reprogramar mi cita", time: "Ayer", temperature: "cold" },
];

const COVER_CHAT: ChatItem[] = [
  { kind: "date", text: "Hoy" },
  { kind: "msg", dir: "in", text: "Hola, ¿cuánto cuesta la limpieza facial?", time: "22:39" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "¡Hola, Lucía! La limpieza facial profunda cuesta S/ 180 y dura 60 minutos. ¿Le gustaría agendar?",
    time: "22:39",
  },
  { kind: "msg", dir: "in", text: "Sí, ¿qué días tienen?", time: "22:40" },
  { kind: "msg", dir: "out", by: "ai", text: "Le paso los horarios libres de esta semana.", time: "22:41" },
];

function SlideCover() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={440}>
        <Title size={48}>Atención, citas y ventas por WhatsApp con inteligencia artificial</Title>
        <p className="mt-8 text-[26px] leading-[1.35] text-gray-300">
          Todo lo que llega por WhatsApp e Instagram, en un solo lugar
        </p>
        <div className="mt-8 flex items-center gap-3">
          <ChannelIcon channel="whatsapp" size={34} />
          <ChannelIcon channel="instagram" size={34} />
          <MetaIcon height={34} />
        </div>
      </TextColumn>
      <Screen
        designW={700}
        designH={600}
        width={570}
        className={`absolute right-[36px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(600 * (570 / 700)) }}
      >
        <main className="flex h-full gap-3 rounded-[12px] bg-slate-50 p-3">
          <ConversationList rows={COVER_ROWS} />
          <ChatPanel contact="Lucía Ramos" items={COVER_CHAT} ai className="min-w-0 flex-1" />
        </main>
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 2: o problema                                                      */
/* ------------------------------------------------------------------------ */

const UNANSWERED = [
  { name: "Lucía", text: "¿Cuánto cuesta la limpieza facial?", time: "22:47", unread: 2 },
  { name: "Andrea", text: "Hola, ¿tienen cita mañana?", time: "22:15", unread: 1 },
  { name: "Carlos", text: "¿Hacen depilación láser?", time: "21:58", unread: 3 },
  { name: "Valeria", text: "Buenas noches, precio del botox", time: "21:30", unread: 1 },
  { name: "Diego", text: "¿Atienden los domingos?", time: "Ayer", unread: 2 },
  { name: "Rosa", text: "Quiero agendar una evaluación", time: "Ayer", unread: 1 },
  { name: "Mariana", text: "¿Aceptan tarjeta?", time: "Sábado", unread: 1 },
];

function SlideProblem() {
  return (
    <Slide>
      <TextColumn width={540}>
        <Title>¿Cuántos pacientes se pierden por responder tarde?</Title>
        <div className="mt-9 space-y-1.5 text-[27px] leading-[1.4] text-gray-300">
          <p>Una persona pregunta el precio de un tratamiento a las 10 de la noche.</p>
          <p>La clínica responde al día siguiente.</p>
          <p className="font-semibold text-white">Para entonces, ya agendó en otra clínica.</p>
        </div>
      </TextColumn>

      {/* Celular inteiro dentro da folha (antes passava da borda e cortava no meio de uma linha). */}
      <div className="absolute left-[650px]" style={{ top: vCenter(714) }}>
        <div
          className="rounded-[52px] border border-white/10 bg-[#1b1e23] p-[12px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          style={{ width: 420 }}
        >
          <div className="h-[690px] overflow-hidden rounded-[42px] bg-white">
            <div className="px-6 pb-3 pt-6">
              <div className="flex items-center justify-between text-[14px] font-semibold text-slate-900">
                <span>22:52</span>
                <span className="h-2 w-10 rounded-full bg-slate-900/80" />
              </div>
              <p className="mt-4 text-[28px] font-bold text-slate-900">Chats</p>
            </div>
            <ul>
              {UNANSWERED.map((c) => (
                <li key={c.name} className="flex items-center gap-3.5 border-t border-slate-100 px-6 py-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[17px] font-semibold text-slate-600">
                    {initials(c.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[18px] font-semibold text-slate-900">{c.name}</span>
                      <span className="shrink-0 text-[13px] font-medium text-[#25D366]">{c.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] text-slate-500">{c.text}</span>
                      <span className="flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-[#25D366] px-1.5 text-[12px] font-bold text-white">
                        {c.unread}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 3: a assistente (configuração + conversa)                          */
/* ------------------------------------------------------------------------ */

const AI_FIELDS = [
  { label: "Objetivo", text: "Resolver las dudas de los pacientes y agendar la evaluación." },
  { label: "Quién es el asistente", text: "Te llamas Sofía, asistente de la clínica. Eres amable y respondes con frases cortas." },
  { label: "Sobre la empresa", text: "Clínica de estética facial y corporal en Miraflores, Lima. Lunes a sábado, de 9:00 a 19:00." },
  { label: "Qué hace", text: "Informas tratamientos y precios: limpieza facial S/ 180, peeling S/ 250, depilación láser desde S/ 120." },
  { label: "Qué NO hace", text: "No das descuentos. No ofreces nada gratis. No recetas medicamentos.", warn: true },
];

function AiConfigScreen() {
  return (
    <main className="h-full overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Asistente de IA</h1>
          <p className="text-[11px] text-slate-500">Configura lo que hace el asistente, en secciones cortas.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
          <span className="relative h-3.5 w-6 rounded-full bg-brand-600">
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          Activada
        </span>
      </div>
      <div className="mt-3 flex gap-4 border-b border-slate-200 text-[12px]">
        <span className="border-b-2 border-brand-600 pb-1.5 font-medium text-slate-900">Asistente</span>
        <span className="pb-1.5 text-slate-400">Comandos</span>
        <span className="pb-1.5 text-slate-400">Herramientas</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {AI_FIELDS.map((f) => (
          <div key={f.label}>
            <p className={`text-[11px] font-semibold ${f.warn ? "text-red-600" : "text-slate-600"}`}>{f.label}</p>
            <p
              className={[
                "mt-1 rounded-[8px] border px-2.5 py-1.5 text-[12px] leading-snug",
                f.warn ? "border-red-200 bg-red-50/60 text-slate-800" : "border-slate-200 text-slate-700",
              ].join(" ")}
            >
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

const ASSISTANT_CHAT: ChatItem[] = [
  { kind: "date", text: "Hoy" },
  { kind: "msg", dir: "in", text: "Hola, ¿cuánto cuesta la limpieza facial?", time: "22:41" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "¡Hola, Lucía! La limpieza facial profunda cuesta S/ 180 y dura 60 minutos.",
    time: "22:41",
  },
  { kind: "audio", duration: "0:14", time: "22:43" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "Entiendo, quiere saber si duele. No duele: es un tratamiento suave y puede volver a su rutina el mismo día.",
    time: "22:43",
  },
  { kind: "msg", dir: "in", text: "Prefiero hablar con una persona", time: "22:45" },
  { kind: "msg", dir: "out", by: "ai", text: "Claro, le paso con alguien del equipo.", time: "22:45" },
  { kind: "note", title: "Pasó al equipo:", body: "limpieza facial, S/ 180, preguntó si duele" },
];

function SlideAssistant() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={390}>
        <Title size={46}>Responde al instante, a cualquier hora</Title>
        <Bullets
          compact
          items={[
            "No es un menú de opciones: entiende lo que escribe el paciente y responde con naturalidad",
            "La clínica le enseña qué decir: tratamientos, precios, horarios, ubicación",
            "Y qué NO decir: no dar descuentos, no ofrecer nada gratis, no recetar medicamentos",
            "Entiende audios",
            "Si el paciente pide hablar con una persona, pasa la conversación al equipo con un resumen",
          ]}
        />
      </TextColumn>
      <Screen
        designW={430}
        designH={500}
        width={340}
        className={`absolute left-[466px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: 96 }}
      >
        <AiConfigScreen />
      </Screen>
      <Screen
        designW={430}
        designH={600}
        width={370}
        className={`absolute right-[36px] z-10 rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(600 * (370 / 430)) + 20 }}
      >
        <ChatPanel contact="Lucía Ramos" items={ASSISTANT_CHAT} ai className="h-full" />
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 4: agenda                                                          */
/* ------------------------------------------------------------------------ */

const AGENDA_CHAT: ChatItem[] = [
  { kind: "date", text: "Hoy" },
  { kind: "msg", dir: "in", text: "Quiero agendar una evaluación", time: "21:10" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "Con gusto. Tengo estos horarios libres:\n• Jueves 12, 10:00\n• Jueves 12, 16:30\n• Viernes 13, 11:00\n¿Cuál prefiere?",
    time: "21:10",
  },
  { kind: "msg", dir: "in", text: "El jueves a las 4:30", time: "21:12" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "Listo, Valeria. Su evaluación quedó agendada para el jueves 12 a las 16:30. La esperamos.",
    time: "21:12",
  },
  { kind: "note", title: "Agendado en Google Calendar:", body: "evaluación, jueves 12, 16:30" },
];

// Novembro de 2026: 12 = quinta, 13 = sexta, 14 = sábado. Horários livres
// batem com a conversa: quinta 10:00 e 16:30, sexta 11:00.
const CAL_DAYS = ["Jue 12", "Vie 13", "Sáb 14"];
const CAL_EVENT_DAY = 0;
const CAL_START = 9;
const CAL_END = 18;
const CAL_EVENTS: { day: number; start: number; end: number; title: string; isNew?: boolean }[] = [
  { day: 0, start: 9, end: 10, title: "Limpieza facial" },
  { day: 0, start: 11, end: 12, title: "Evaluación" },
  { day: 0, start: 14, end: 15.5, title: "Botox" },
  { day: 0, start: 16.5, end: 17.5, title: "Evaluación · Valeria Soto", isNew: true },
  { day: 1, start: 9.5, end: 10.5, title: "Peeling" },
  { day: 1, start: 12, end: 13, title: "Evaluación" },
  { day: 1, start: 15, end: 16.5, title: "Depilación láser" },
  { day: 2, start: 9, end: 10, title: "Peeling" },
  { day: 2, start: 11, end: 12.5, title: "Depilación láser" },
  { day: 2, start: 15, end: 16, title: "Evaluación" },
  { day: 2, start: 16.5, end: 17.5, title: "Limpieza facial" },
];

function CalendarScreen() {
  const hourH = 44;
  const hours = Array.from({ length: CAL_END - CAL_START }, (_, i) => CAL_START + i);
  return (
    <main className="flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-2.5">
        <span className="flex h-7 w-7 flex-col overflow-hidden rounded-[6px] border border-slate-200 text-center">
          <span className="h-2 bg-[#1a73e8]" />
          <span className="text-[11px] font-bold leading-[18px] text-[#1a73e8]">12</span>
        </span>
        <span className="text-[15px] text-slate-700">Google Calendar</span>
        <span className="ml-auto text-[12px] font-medium text-slate-600">noviembre</span>
      </div>
      <div className="flex border-b border-slate-200 pl-[44px]">
        {CAL_DAYS.map((d, i) => (
          <div key={d} className={`flex-1 py-1.5 text-center text-[12px] ${i === CAL_EVENT_DAY ? "font-semibold text-[#1a73e8]" : "text-slate-500"}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="relative flex-1">
        {hours.map((h, i) => (
          <div key={h} className="absolute left-0 right-0 border-t border-slate-100" style={{ top: i * hourH }}>
            <span className="absolute left-2 -translate-y-1/2 bg-white px-0.5 text-[10px] text-slate-400">{h}:00</span>
          </div>
        ))}
        <div className="absolute bottom-0 left-[44px] right-0 top-0 flex">
          {CAL_DAYS.map((d, day) => (
            <div key={d} className="relative flex-1 border-l border-slate-100">
              {CAL_EVENTS.filter((e) => e.day === day).map((e) => (
                <div
                  key={e.title + e.start}
                  className={[
                    "absolute left-1 right-1 overflow-hidden rounded-[6px] px-1.5 py-1 text-[10.5px] leading-tight",
                    e.isNew
                      ? "z-10 bg-brand-600 font-semibold text-white ring-2 ring-brand-300 ring-offset-1"
                      : "bg-[#e8f0fe] text-[#1967d2]",
                  ].join(" ")}
                  style={{ top: (e.start - CAL_START) * hourH + 1, height: (e.end - e.start) * hourH - 3 }}
                >
                  {e.title}
                  <span className={`block text-[9.5px] font-normal ${e.isNew ? "text-white/85" : "text-[#1967d2]/70"}`}>
                    {fmtHour(e.start)} a {fmtHour(e.end)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function fmtHour(h: number) {
  const m = Math.round((h % 1) * 60);
  return `${Math.floor(h)}:${m.toString().padStart(2, "0")}`;
}

function SlideAgenda() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={378}>
        <Title size={48}>La asistente agenda la cita sola</Title>
        <Bullets
          items={[
            "Ofrece solo los horarios libres",
            "Agenda directamente en Google Calendar de la clínica",
            "Puede agendar sola o solo sugerir horarios para que el equipo confirme",
            "Nunca agenda dos personas en el mismo horario",
          ]}
          compact
        />
      </TextColumn>
      <Screen
        designW={420}
        designH={560}
        width={318}
        className={`absolute left-[452px] z-10 rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(560 * (318 / 420)) }}
      >
        <ChatPanel contact="Valeria Soto" items={AGENDA_CHAT} ai className="h-full" />
      </Screen>
      <Screen
        designW={400}
        designH={500}
        width={310}
        className={`absolute right-[36px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(500 * (310 / 400)) + 18 }}
      >
        <CalendarScreen />
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 5: a equipe toda numa bandeja                                      */
/* ------------------------------------------------------------------------ */

const UNREAD_ROWS: Row[] = [
  { name: "Andrea Vega", channel: "instagram", preview: "Sí, por favor", time: "18:44", unread: 1, active: true, temperature: "hot", assignee: "Marina", tag: { text: "Peeling", color: "#c4b5fd" } },
  { name: "Carlos Mendoza", channel: "whatsapp", preview: "¿Atienden los sábados?", time: "18:31", unread: 1, temperature: "cold" },
  { name: "Rosa Quispe", channel: "whatsapp", preview: "¿Puedo pagar en cuotas?", time: "18:20", unread: 2, temperature: "warm", assignee: "Paulo" },
  { name: "Diego Paredes", channel: "instagram", preview: "Me interesa el botox", time: "17:55", unread: 3, temperature: "warm" },
  { name: "Mariana Díaz", channel: "whatsapp", preview: "¿Me reenvían la dirección?", time: "17:12", unread: 1, temperature: "cold", assignee: "Carla" },
  { name: "Javier Torres", channel: "instagram", preview: "Necesito cambiar mi cita", time: "16:40", unread: 1, temperature: "warm", assignee: "Paulo" },
  { name: "Gabriela Ríos", channel: "whatsapp", preview: "¿Hacen depilación láser?", time: "15:08", unread: 2, temperature: "cold" },
];

const TEAM_CHAT: ChatItem[] = [
  { kind: "msg", dir: "in", text: "Hola, vi su publicación del peeling. ¿Tienen fecha esta semana?", time: "18:38" },
  { kind: "msg", dir: "out", by: "Marina", text: "Hola, Andrea, soy Marina. Sí, tenemos el viernes a las 11:00. ¿Se lo reservo?", time: "18:41" },
  { kind: "msg", dir: "in", text: "Sí, por favor", time: "18:44" },
];

function SlideTeam() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={350}>
        <Title size={44}>Todas las conversaciones en un solo lugar</Title>
        <Bullets
          compact
          items={[
            "WhatsApp e Instagram llegan a la misma bandeja (planes Profesional y Completo)",
            "Varias personas atienden al mismo tiempo, cada una con su usuario",
            "Cada conversación se asigna a una persona del equipo",
            "Filtro de no leídos: se ve al momento quién quedó sin respuesta",
            "El historial queda guardado. Aunque alguien borre un chat en su teléfono, la clínica no lo pierde",
          ]}
        />
      </TextColumn>
      <Screen
        designW={720}
        designH={640}
        width={660}
        className={`absolute right-[36px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(640 * (660 / 720)) }}
      >
        <main className="flex h-full gap-3 rounded-[12px] bg-slate-50 p-3">
          <ConversationList rows={UNREAD_ROWS} filter="No leídas" width={225} />
          <ChatPanel
            contact="Andrea Vega"
            channel="instagram"
            items={TEAM_CHAT}
            ai={false}
            assignee="Marina"
            assigneeMenu={["Nadie", "Tú", "Marina", "Paulo", "Carla"]}
            className="min-w-0 flex-1"
          />
        </main>
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 6: campanhas e resultados (plano Completo)                         */
/* ------------------------------------------------------------------------ */

const RESULT_CAMPAIGNS = [
  { name: "Limpieza facial noviembre", platform: "meta" as const, spend: "S/ 980", talks: 64, sales: 14 },
  { name: "Depilación láser", platform: "meta" as const, spend: "S/ 720", talks: 41, sales: 9 },
  { name: "Clínica estética Miraflores", platform: "google" as const, spend: "S/ 850", talks: 37, sales: 11 },
];

/** "Meta + Google" com os logos, para deixar claro que são anúncios. */
function AdsSources() {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
      <MetaGlyph height={8} />
      Meta
      <span className="text-slate-300">·</span>
      <GoogleGlyph size={10} />
      Google
    </span>
  );
}

function ResultsScreen() {
  return (
    <main className="flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">Resultados</h1>
          <p className="text-[11px] text-slate-500">Ventas, inversión en anuncios y lo que necesita tu atención.</p>
        </div>
        <div className="flex gap-1 rounded-[8px] border border-slate-200 bg-white p-0.5 text-[11px]">
          {["7 días", "30 días", "Este mes"].map((p) => (
            <span key={p} className={`rounded-[6px] px-2 py-0.5 ${p === "30 días" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <KpiCard label="Ventas" value="38" sub="S/ 24,600 en ventas" />
        <KpiCard label="Inversión en anuncios" value="S/ 3,150" sub={<AdsSources />} />
        <KpiCard label="Retorno general" value="7.8x" sub="vs. período anterior +12%" good />
        <KpiCard label="Costo por venta" value="S/ 83" sub="Inversión ÷ ventas" />
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 p-3">
        <span className="shrink-0 rounded-full bg-amber-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-800">Atención</span>
        <p className="text-[11px] leading-snug text-amber-900">
          <span className="font-semibold">Necesita atención:</span> la campaña Botox primera vez está activa, pero no gasta
          hace 3 días. Revisa el presupuesto y la forma de pago.
        </p>
      </div>

      <div className="mt-2 flex-1 rounded-[10px] border border-slate-200 bg-white p-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">Campañas de anuncios <AdsSources /></p>
        <table className="mt-1 w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10.5px] text-slate-400">
              <th className="py-1 font-medium">Campaña</th>
              <th className="py-1 font-medium">Anuncio en</th>
              <th className="py-1 text-right font-medium">Inversión</th>
              <th className="py-1 text-right font-medium">Conversaciones</th>
              <th className="py-1 text-right font-medium">Ventas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {RESULT_CAMPAIGNS.map((c) => (
              <tr key={c.name}>
                <td className="py-1.5 font-medium">{c.name}</td>
                <td className="py-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {c.platform === "google" ? <GoogleGlyph size={12} /> : <MetaGlyph height={9} />}
                    {c.platform === "google" ? "Google" : "Meta"}
                  </span>
                </td>
                <td className="py-1.5 text-right tabular-nums">{c.spend}</td>
                <td className="py-1.5 text-right tabular-nums">{c.talks}</td>
                <td className="py-1.5 text-right tabular-nums">{c.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function KpiCard({ label, value, sub, good }: { label: string; value: string; sub: React.ReactNode; good?: boolean }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-2.5">
      <p className="truncate text-[10.5px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-[19px] font-semibold tabular-nums leading-tight">{value}</p>
      <p className={`mt-0.5 truncate text-[10px] ${good ? "text-brand-700" : "text-slate-400"}`}>{sub}</p>
    </div>
  );
}

// Funil de verdade da plataforma: réplica do FunnelBlock do painel de
// Resultados (auto_agendador/apps/web/src/components/roi-panel/FunnelBlock.tsx),
// mesma geometria fixa, cores e grupos ARRIBA/MEDIO/ABAJO. Rótulos do
// roiPanel.funnel do es.json, exceto "Leads", que virou "Interesados" (regra
// de texto do material). Valores fictícios; Compras = Ventas do painel.
const F_CX = 917;
const F_SCALE = 1.15;
const F_VIEW_W = 2339;
// Altura cortada logo abaixo da última faixa (o original sobra ~160 de vazio).
const F_VIEW_H = 1495;

type FunnelBand = {
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

const F_BANDS: FunnelBand[] = [
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

const F_STAGES = ["Audiencia", "Visitantes", "Interesados", "Compras"];
const F_VALUES = [48200, 3950, 170, 38];

function fWallXAt(b: FunnelBand, y: number) {
  const t = (y - b.topY) / (b.botY - b.topY);
  const rawX = b.topRightX + t * (b.botRightX - b.topRightX);
  return F_CX + (rawX - F_CX) * F_SCALE;
}

function fFitaPath(b: FunnelBand) {
  const r = b.fitaR;
  return `M ${b.fitaX0} ${b.fitaY0} H ${b.fitaEndX - r} A ${r} ${r} 0 0 1 ${b.fitaEndX} ${b.fitaY0 + r} V ${b.fitaY1 - r} A ${r} ${r} 0 0 1 ${b.fitaEndX - r} ${b.fitaY1} H ${b.fitaX0} Z`;
}

function FunnelCard() {
  const gaps: number[] = [];
  for (let i = 0; i < F_BANDS.length - 1; i++) {
    gaps.push((F_BANDS[i].botY + F_BANDS[i + 1].ellipseCy - F_BANDS[i + 1].ellipseRy) / 2);
  }
  const LINE_TOP = 25;
  const lineYs = [LINE_TOP, gaps[1], gaps[2]];
  const brackets = [
    { label: "ARRIBA", y0: LINE_TOP, y1: gaps[1] },
    { label: "MEDIO", y0: gaps[1] + 18, y1: gaps[2] },
    { label: "ABAJO", y0: gaps[2] + 18, y1: F_BANDS[3].botY + 16 },
  ];
  return (
    <section className="flex h-full flex-col rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex flex-1 items-center justify-center">
        <svg viewBox={`0 0 ${F_VIEW_W} ${F_VIEW_H}`} className="w-full" role="img" aria-label="Embudo">
          {lineYs.map((y, i) => (
            <line key={i} x1={205} y1={y} x2={2310} y2={y} strokeWidth={6} strokeDasharray="30 31" stroke="#10233F" />
          ))}
          {brackets.map((g) => {
            const cy = (g.y0 + g.y1) / 2;
            return (
              <g key={g.label}>
                <path d={`M 204 ${g.y0} H 164 V ${g.y1} H 204`} fill="none" strokeWidth={9} stroke="#10233F" />
                <text
                  x={78}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(-90 78 ${cy})`}
                  fill="#10233F"
                  style={{ fontSize: 52, fontWeight: 700 }}
                >
                  {g.label}
                </text>
              </g>
            );
          })}
          {F_BANDS.map((b, i) => {
            const val = F_VALUES[i];
            const prev = i > 0 ? F_VALUES[i - 1] : null;
            const conv = prev ? ((val / prev) * 100).toFixed(1) : null;
            const numY = b.topY + (b.botY - b.topY) * b.numWeight + 14;
            const numStr = val.toLocaleString("en-US");
            const availWidth = 2 * (fWallXAt(b, numY) - F_CX);
            const numFontSize = Math.min(120, (availWidth * 0.82) / (numStr.length * 0.62));
            const startX = (fWallXAt(b, b.fitaY0) + fWallXAt(b, b.fitaY1)) / 2;
            const labelCx = (startX + b.fitaEndX) / 2;
            const midY = (b.fitaY0 + b.fitaY1) / 2;
            const labelCy = conv !== null ? midY - 29 : midY;
            return (
              <g key={F_STAGES[i]}>
                <path d={fFitaPath(b)} fill={b.fill} />
                <g transform={`translate(${F_CX},0) scale(${F_SCALE},1) translate(${-F_CX},0)`}>
                  <path d={b.corpo} fill={b.fill} />
                  <ellipse cx={F_CX} cy={b.ellipseCy} rx={b.ellipseRx} ry={b.ellipseRy} fill={b.rim} />
                </g>
                <text x={F_CX} y={numY} fill="#fff" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: numFontSize, fontWeight: 800 }}>
                  {numStr}
                </text>
                <text x={labelCx} y={labelCy} fill="#fff" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 92, fontWeight: 600 }}>
                  {F_STAGES[i]}
                </text>
                {conv !== null && (
                  <text x={labelCx} y={midY + 60} fill="#fff" opacity={0.85} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 72 }}>
                    {conv}%
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

function SlideResults() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={380}>
        <Eyebrow>Plan Completo</Eyebrow>
        <Title size={48}>Qué anuncio trajo cada paciente</Title>
        <Bullets
          items={[
            "Cada conversación llega sabiendo de qué anuncio de Meta o Google vino",
            "Panel con inversión, ventas y retorno por anuncio, en la moneda de la clínica",
            "Alertas cuando una campaña no está gastando o tiene problemas",
          ]}
        />
      </TextColumn>
      <Screen
        designW={640}
        designH={405}
        width={580}
        className={`absolute right-[36px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: AREA_TOP }}
      >
        <ResultsScreen />
      </Screen>
      <Screen
        designW={400}
        designH={268}
        width={480}
        className={`absolute z-10 rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ left: 557, bottom: 22 }}
      >
        <FunnelCard />
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 7: envios em massa (plano Completo)                                */
/* ------------------------------------------------------------------------ */

const BROADCAST_STEPS = ["Número", "Audiencia", "Mensaje", "Ajustes", "Revisión"];

function SlideBroadcast() {
  return (
    <Slide glow="72% 50%">
      <TextColumn width={370}>
        <Eyebrow>Plan Completo</Eyebrow>
        <Title size={48}>Una promoción para todos sus pacientes de una vez</Title>
        <Bullets
          items={[
            "Envíos masivos con plantilla: promociones, campañas, recordatorios",
            "Elige quién recibe, por etiquetas o subiendo una lista",
            "Envía en el momento o programa el día y la hora",
          ]}
        />
      </TextColumn>
      <Screen
        designW={660}
        designH={560}
        width={640}
        className={`absolute right-[36px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(560 * (640 / 660)) }}
      >
        <BroadcastReview />
      </Screen>
    </Slide>
  );
}

/** Revisão do envio (disparos/novo/revisar), rótulos do broadcasts.wizard do es.json. */
function BroadcastReview() {
  return (
    <main className="flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4">
      <ol className="flex items-center gap-1.5 text-[11px]">
        {BROADCAST_STEPS.map((step, i) => {
          const current = i === BROADCAST_STEPS.length - 1;
          return (
            <li key={step} className="flex items-center gap-1.5">
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  current ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700",
                ].join(" ")}
              >
                {current ? i + 1 : "✓"}
              </span>
              <span className={current ? "font-medium text-slate-900" : "text-slate-500"}>{step}</span>
              {i < BROADCAST_STEPS.length - 1 && <span className="mx-0.5 h-px w-4 bg-slate-200" />}
            </li>
          );
        })}
      </ol>

      <h1 className="mt-4 text-xl font-semibold">Revisar y enviar</h1>
      <p className="text-[12px] text-slate-500">Confirma todo antes de mandar a toda la base.</p>

      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <ReviewCard label="Nombre del envío" value="Peeling noviembre" />
            <ReviewCard label="Audiencia" value="Limpieza facial" />
            <ReviewCard label="Contactos incluidos" value="412" />
            <ReviewCard label="Modelo elegido" value="promo_peeling" />
            <ReviewCard label="Envío" value="Mar 17/11, 10:00" />
            <ReviewCard label="Intervalo" value="5s entre envíos" />
          </div>
          <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Checklist previo al envío</p>
            <ReviewCheck label="Modelo aprobado" />
            <ReviewCheck label="412 destinatarios listos" />
            <ReviewCheck label="Imagen de encabezado adjunta" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Probar mensaje</span>
            <span className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white">Enviar a 412 personas</span>
          </div>
        </div>

        <div className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-slate-200">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-500">
            Vista previa en WhatsApp
          </p>
          <div className="mock-chat-bg flex-1 p-3">
            <div className="overflow-hidden rounded-[8px] rounded-tl-none bg-white shadow-sm">
              <div
                className="flex h-[124px] flex-col justify-end p-3 text-white"
                style={{ background: "linear-gradient(135deg, #b4746a 0%, #8a4f47 55%, #3b2a2a 100%)" }}
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/75">Nuevos horarios</span>
                <span className="text-[19px] font-bold leading-tight">Peeling facial</span>
                <span className="text-[11px] text-white/85">Noviembre</span>
              </div>
              <p className="px-2.5 py-2 text-[12.5px] leading-snug text-slate-800">
                Hola, Rosa. En noviembre abrimos nuevos horarios para peeling facial. ¿Le reservamos uno?
                <span className="ml-1.5 text-[10px] text-slate-400">10:00</span>
              </p>
              <p className="border-t border-slate-100 py-1.5 text-center text-[12.5px] font-medium text-sky-600">Quiero agendar</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ReviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-2.5">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function ReviewCheck({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-slate-600">
      <span aria-hidden className="text-brand-600">
        ✓
      </span>
      {label}
    </p>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 9: planos (sem preço)                                              */
/* ------------------------------------------------------------------------ */

const PLANS = ["Esencial", "Profesional", "Completo"];
const PLAN_ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Usuarios", values: ["2", "5", "12"] },
  { label: "Contactos", values: ["5,000", "20,000", "100,000"] },
  { label: "Respuestas de la asistente al mes", values: ["300", "1,500", "5,000"] },
  { label: "Idiomas", values: ["Español", "Varios", "Varios"] },
  { label: "Conversaciones por WhatsApp", values: [true, true, true] },
  { label: "Conversaciones por Instagram", values: [false, true, true] },
  { label: "Agenda con la asistente", values: [false, true, true] },
  { label: "Ventas, seguimiento y automatizaciones", values: [false, true, true] },
  { label: "Envíos masivos", values: [false, false, true] },
  { label: "Anuncios de Meta y Google con retorno", values: [false, false, true] },
  { label: "Soporte", values: ["Centro de ayuda", "Email", "Prioritario"] },
];

function SlidePlans() {
  return (
    <Slide glow="50% 40%">
      <div className="absolute left-[56px] right-[56px]" style={{ top: AREA_TOP }}>
        <Title size={44}>Elija el plan de su clínica</Title>
        <table className="mt-5 w-full border-separate border-spacing-0 text-[19px]">
          <thead>
            <tr>
              <th className="w-[40%]" />
              {PLANS.map((p, i) => (
                <th
                  key={p}
                  className={[
                    "rounded-t-[14px] py-2.5 text-center text-[22px] font-semibold",
                    i === 1 ? "bg-brand-600 text-white" : "bg-white/[0.06] text-white",
                  ].join(" ")}
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAN_ROWS.map((row, r) => (
              <tr key={row.label}>
                <td className={`border-t border-white/10 py-[7px] pr-4 text-gray-300 ${r === 0 ? "border-t-0" : ""}`}>{row.label}</td>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={[
                      "border-t border-white/10 py-[7px] text-center tabular-nums",
                      i === 1 ? "bg-brand-500/[0.12]" : "bg-white/[0.03]",
                      r === PLAN_ROWS.length - 1 ? "rounded-b-[14px]" : "",
                    ].join(" ")}
                  >
                    {v === true ? (
                      <span className="font-semibold text-brand-400">✓</span>
                    ) : v === false ? (
                      <span className="text-gray-600">·</span>
                    ) : (
                      <span className="font-medium text-white">{v}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center gap-6 rounded-[16px] border border-white/10 bg-white/[0.04] px-6 py-3">
          <p className="shrink-0 text-[30px] font-semibold leading-none text-brand-400">
            € 0.02
          </p>
          <p className="text-[17px] leading-snug text-gray-300">
            <span className="font-semibold text-white">Aparte del plan:</span> cada automatización y cada envío masivo (por
            destinatario) cuesta € 0.02.
            <br />
            Los templates de WhatsApp los cobra Meta directamente a la clínica.
          </p>
        </div>
      </div>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Página 8: como conecta o WhatsApp                                         */
/* ------------------------------------------------------------------------ */

function SlideConnect() {
  return (
    <Slide glow="50% 40%">
      <div
        className="absolute left-[56px] right-[56px] flex flex-col justify-center"
        style={{ top: AREA_TOP, bottom: H - AREA_BOTTOM }}
      >
        <Title size={46}>Cómo se conecta el WhatsApp</Title>
        <div className="mt-6 grid grid-cols-2 gap-5">
          <ConnectCard
            title="Número normal"
            visual={<QrPhone />}
            items={[
              "Se conecta en minutos escaneando un código QR, igual que WhatsApp Web",
              "Sin costo ni verificación",
              "No sirve para envíos masivos: Meta puede bloquear el número",
            ]}
          />
          <ConnectCard
            title="Número oficial de WhatsApp"
            highlight
            visual={<VerifiedProfile />}
            items={[
              "Nosotros hacemos todo, desde la verificación de la página hasta dejar el número funcionando",
              "Normalmente en 1 día. Si la página tiene historial con Meta (un cambio de nombre, por ejemplo), puede tardar más",
            ]}
          />
        </div>
        <Screen designW={1011} designH={176} width={1011} className={`mt-5 rounded-[12px] ${SCREEN_SHADOW}`}>
          <ChannelsScreen />
        </Screen>
      </div>
    </Slide>
  );
}

function ConnectCard({
  title,
  items,
  visual,
  highlight,
}: {
  title: string;
  items: string[];
  visual: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex gap-5 rounded-[20px] border px-6 py-5",
        highlight ? "border-brand-500/50 bg-brand-500/[0.08]" : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2.5 text-[23px] font-semibold leading-tight">
          <ChannelIcon channel="whatsapp" size={26} />
          {title}
        </p>
        <ul className="mt-4 space-y-3 text-[18px] leading-snug text-gray-300">
          {items.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-[140px] shrink-0 items-center justify-center">{visual}</div>
    </div>
  );
}

// QR decorativo (não aponta para lugar nenhum): três quadrados de canto e
// módulos pseudoaleatórios fixos, para não variar entre renderizações.
function DecorativeQr({ size }: { size: number }) {
  const n = 21;
  const cells: React.ReactNode[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!inFinder(x, y) && rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
    }
  }
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width={7} height={7} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} shapeRendering="crispEdges" fill="#0f172a" aria-hidden>
      {cells}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}

/** Celular com o QR de "Vincular un dispositivo" (número normal). */
function QrPhone() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#1b1e23] p-[6px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex h-[200px] w-[112px] flex-col items-center overflow-hidden rounded-[21px] bg-white px-2 pt-4">
        <p className="text-center text-[9px] font-semibold leading-tight text-slate-800">Vincular un dispositivo</p>
        <div className="mt-3 rounded-[6px] border border-slate-200 p-1.5">
          <DecorativeQr size={74} />
        </div>
        <p className="mt-2.5 text-center text-[7.5px] leading-snug text-slate-500">
          Apunta la cámara a este código QR
        </p>
        <span className="mt-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

/** Perfil de empresa verificado (número oficial). */
function VerifiedProfile() {
  return (
    <div className="w-[140px] rounded-[16px] bg-white p-3 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]">
      {/* Marca fictícia ("Clínica Alma"): monograma em folha, tons de rosé. */}
      <span
        className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full ring-1 ring-[#e3c3b6]"
        style={{ background: "linear-gradient(145deg, #f8ece7 0%, #ecd3c8 100%)" }}
      >
        <svg viewBox="0 0 40 40" width={50} height={50} aria-hidden>
          <path d="M20 7c6.5 4.2 9 9.6 7.4 15.4-1.2 4.4-4.4 7.5-7.4 9.6-3-2.1-6.2-5.2-7.4-9.6C11 16.6 13.5 11.2 20 7Z" fill="#9a5b4c" />
          <path d="M20 12v19" stroke="#f6e7e1" strokeWidth={1.4} strokeLinecap="round" />
          <path d="M20 19c2-1.6 3.6-2.3 5.2-2.6M20 24c-2-1.6-3.6-2.3-5.2-2.6" stroke="#f6e7e1" strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <p className="mt-2 flex items-center justify-center gap-1 text-[12px] font-semibold text-slate-900">
        Clínica Alma
        <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden>
          <path
            fill="#25D366"
            d="M12 1.5l2.4 1.8 3-.2 1 2.8 2.5 1.7-.8 2.9.8 2.9-2.5 1.7-1 2.8-3-.2L12 20.5l-2.4-1.8-3 .2-1-2.8-2.5-1.7.8-2.9-.8-2.9 2.5-1.7 1-2.8 3 .2Z"
          />
          <path d="m8 11.5 2.7 2.7L16 9" fill="none" stroke="#fff" strokeWidth={2.2} />
        </svg>
      </p>
      <p className="text-[10px] text-slate-500">Cuenta de empresa</p>
      <p className="mt-2 rounded-full bg-emerald-50 px-2 py-1 text-[9.5px] font-medium text-emerald-700">Número verificado</p>
    </div>
  );
}

/** Configuración > Canales, com os canais conectados. */
const CHANNEL_ROWS: { channel: Channel; title: string; detail: string }[] = [
  { channel: "whatsapp", title: "WhatsApp oficial", detail: "+51 9•• ••• •12 · Recepción" },
  { channel: "whatsapp", title: "WhatsApp normal", detail: "+51 9•• ••• •47 · Ventas" },
  { channel: "instagram", title: "Instagram", detail: "@clinicaalma" },
];

function ChannelsScreen() {
  return (
    <main className="h-full overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-[17px] font-semibold">Canales</h1>
        <p className="text-[12px] text-slate-500">Configuración</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {CHANNEL_ROWS.map((c) => (
          <div key={c.title} className="rounded-[10px] border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <ChannelIcon channel={c.channel} size={22} />
              <span className="truncate text-[13.5px] font-semibold">{c.title}</span>
            </div>
            <p className="mt-1.5 truncate text-[12px] text-slate-500">{c.detail}</p>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Conectado
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
