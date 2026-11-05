import { Logo } from "@/components/Logo";
import { QR_PATH, QR_SIZE } from "./qr";

// Apresentação para donos de escolas de dança (o Marçal apresenta).
// Conteúdo aprovado no vault comercial: "Apresentacao - escolas de danca
// (rascunho A4 deitado)". Cada slide tem o tamanho de uma folha A4 deitada
// a 96 dpi (1123 x 794); no @media print vira uma página A4 por slide.
//
// As telas são réplicas estáticas da plataforma (auto_agendador, apps/web):
// mesmas classes e rótulos da /inbox, da ficha do contato, da revisão do
// disparo e do /roi, desenhadas num tamanho de "tela" e ampliadas com
// transform, como os mockups da LP (components/mockup/). Nomes, horários,
// valores e conversas são fictícios.
//
// Regras de texto: sem emoji, sem travessão, título sem ponto, nada de
// "lead", "funil", "CRM", "API". Fora dos slides (decidido em 04/11): quadro
// de etapas, lembrete de aula, números do Saculejo.

const W = 1123;
const H = 794;

export function DanceSlides() {
  return (
    <div className="slides flex flex-col items-center gap-10 py-10">
      <SlideProblem />
      <SlideAssistant />
      <SlideTeam />
      <SlideBroadcast />
      <SlideIntegrations />
      <SlideNextStep />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Estrutura comum                                                           */
/* ------------------------------------------------------------------------ */

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="slide relative shrink-0 overflow-hidden bg-gray-950 font-sans text-white"
      style={{ width: W, height: H }}
    >
      {/* Brilho verde discreto atrás do visual, o mesmo tom da marca. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(55% 70% at 78% 45%, rgba(22,163,74,0.14), transparent 70%)" }}
      />
      <header className="absolute left-[56px] top-[28px] z-10 flex items-center gap-2.5">
        <Logo size={28} />
        <span className="text-[18px] font-semibold tracking-tight">Sales Flow</span>
      </header>
      {children}
    </section>
  );
}

// Área útil abaixo do logo: o conteúdo ocupa a folha quase inteira, sem
// faixa vazia em cima e embaixo (pedido do usuário: espaço vazio obriga a
// dar zoom).
const AREA_TOP = 76;
const AREA_BOTTOM = H - 28;
/** `top` que centraliza um bloco de altura `h` na área útil. */
const vCenter = (h: number) => AREA_TOP + (AREA_BOTTOM - AREA_TOP - h) / 2;

/** Coluna de texto à esquerda, centrada na altura da área útil. */
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

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[50px] font-semibold leading-[1.06] tracking-[-0.025em]">{children}</h2>;
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-9 space-y-5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[25px] leading-[1.32] text-gray-300">
          <span className="mt-[12px] h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
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

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor" className={className}>
      <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Conversa (painel da /inbox), usada nos slides 2 e 3                       */
/* ------------------------------------------------------------------------ */

type ChatItem =
  | { kind: "date"; text: string }
  | { kind: "msg"; dir: "in"; text: string; time: string }
  | { kind: "msg"; dir: "out"; by: "ai" | string; text: string; time: string }
  | { kind: "note"; title: string; body: string };

function ChatPanel({
  contact,
  items,
  ai,
  assignee,
  className,
}: {
  contact: string;
  items: ChatItem[];
  ai: boolean;
  assignee?: string;
  className?: string;
}) {
  let prevKey: string | null = null;
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm ${className ?? ""}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 px-1 py-0.5">
          <ContactAvatar name={contact} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium leading-tight">{contact}</div>
            <div className="truncate text-[11px] uppercase text-slate-400">WhatsApp · Escola de dança</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {assignee && (
            <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
              <span className="text-slate-400">Atribuído a:</span>
              <span className="font-medium text-slate-800">{assignee}</span>
            </span>
          )}
          {ai ? (
            <span className="flex items-center gap-2 rounded-full border border-green-600 bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              IA ativa
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              IA desativada
            </span>
          )}
        </div>
      </header>
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
            const mine = item.dir === "out";
            const key = item.dir === "out" ? `out-${item.by}` : "in";
            const startsGroup = prevKey !== key;
            prevKey = key;
            const author = item.dir === "out" ? item.by : null;
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
                  <span className="whitespace-pre-wrap break-words">{item.text}</span>
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
          Escreva uma mensagem…
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

/* ------------------------------------------------------------------------ */
/* Slide 1: mensagens sem resposta                                           */
/* ------------------------------------------------------------------------ */

const UNANSWERED = [
  { name: "Juliana", text: "Oi, queria saber os horários", time: "23:47", unread: 3 },
  { name: "Rafael", text: "Vocês têm turma de forró?", time: "23:02", unread: 1 },
  { name: "Camila", text: "Quanto custa a aula?", time: "22:14", unread: 2 },
  { name: "Bruno", text: "Boa noite, qual o valor?", time: "Ontem", unread: 1 },
  { name: "Larissa", text: "Tem aula experimental?", time: "Sábado", unread: 2 },
  { name: "Thiago", text: "Ainda tem vaga no zouk?", time: "Sábado", unread: 1 },
  { name: "Fernanda", text: "Vocês aceitam Gympass?", time: "Sábado", unread: 2 },
  { name: "Pedro", text: "Tem aula para iniciante?", time: "Sexta", unread: 1 },
];

function SlideProblem() {
  return (
    <Slide>
      <TextColumn width={520}>
        <Title>Quantos alunos você perde por demorar a responder</Title>
        <div className="mt-9 space-y-1.5 text-[27px] leading-[1.4] text-gray-300">
          <p>A pessoa manda &ldquo;quanto custa a aula?&rdquo; às 22h.</p>
          <p>Você responde no dia seguinte.</p>
          <p className="font-semibold text-white">Ela já foi para outra escola.</p>
        </div>
      </TextColumn>

      {/* Celular com a lista do WhatsApp cheia de mensagens sem resposta (montagem). */}
      <div className="absolute left-[640px] top-[40px]">
        <div
          className="rounded-[52px] border border-white/10 bg-[#1b1e23] p-[12px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          style={{ width: 420 }}
        >
          <div className="h-[760px] overflow-hidden rounded-[42px] bg-white">
            <div className="px-6 pb-3 pt-6">
              <div className="flex items-center justify-between text-[14px] font-semibold text-slate-900">
                <span>23:52</span>
                <span className="h-2 w-10 rounded-full bg-slate-900/80" />
              </div>
              <p className="mt-4 text-[28px] font-bold text-slate-900">Conversas</p>
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
/* Slide 2: a assistente conversando e marcando a aula                       */
/* ------------------------------------------------------------------------ */

const ASSISTANT_CHAT: ChatItem[] = [
  { kind: "date", text: "Hoje" },
  { kind: "msg", dir: "in", text: "Oi! Vocês têm aula de forró? Que dias?", time: "22:07" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "Oi, Juliana! Temos sim, terça e quinta às 19h. A primeira aula é experimental e gratuita. Quer marcar?",
    time: "22:07",
  },
  { kind: "msg", dir: "in", text: "Quinta às 19h pode ser?", time: "22:09" },
  { kind: "msg", dir: "out", by: "ai", text: "Pode sim! Marquei sua aula experimental para quinta, às 19h.", time: "22:09" },
  { kind: "note", title: "Marcado no Google Agenda:", body: "aula experimental de forró, quinta 19h" },
  { kind: "msg", dir: "in", text: "Perfeito! Preciso levar alguma coisa?", time: "22:10" },
  {
    kind: "msg",
    dir: "out",
    by: "ai",
    text: "Só roupa confortável e vontade de dançar. Te esperamos na quinta!",
    time: "22:10",
  },
];

function SlideAssistant() {
  return (
    <Slide>
      <TextColumn width={400}>
        <Title>Uma assistente que responde na hora, até de madrugada</Title>
        <Bullets
          items={[
            "Responde preço, horários e estilos",
            "Marca a aula experimental no Google Agenda",
            "Você entra na conversa quando quiser",
          ]}
        />
      </TextColumn>
      <Screen
        designW={480}
        designH={545}
        width={600}
        className={`absolute right-[44px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(545 * (600 / 480)) }}
      >
        <ChatPanel contact="Juliana" items={ASSISTANT_CHAT} ai className="h-full" />
      </Screen>
    </Slide>
  );
}

/* ------------------------------------------------------------------------ */
/* Slide 3: a equipe toda no mesmo WhatsApp                                  */
/* ------------------------------------------------------------------------ */

type Temperature = "cold" | "warm" | "hot";
const TEMPERATURE: Record<Temperature, { label: string; cls: string }> = {
  cold: { label: "Frio", cls: "bg-sky-100 text-sky-700" },
  warm: { label: "Morno", cls: "bg-amber-100 text-amber-700" },
  hot: { label: "Quente", cls: "bg-red-100 text-red-700" },
};

const QUEUE: {
  name: string;
  preview: string;
  time: string;
  out?: boolean;
  unread?: boolean;
  active?: boolean;
  temperature?: Temperature;
  tag?: { text: string; color: string };
  assignee?: string;
}[] = [
  {
    name: "Rafael",
    preview: "Tenho horário na sexta às 18h",
    time: "18:42",
    out: true,
    active: true,
    temperature: "hot",
    tag: { text: "Aula particular", color: "#c4b5fd" },
    assignee: "Marina",
  },
  { name: "Juliana", preview: "Marquei sua aula experimental", time: "18:30", out: true, temperature: "hot", tag: { text: "Forró", color: "#fde68a" } },
  { name: "Camila", preview: "Vocês têm turma de zouk?", time: "18:21", unread: true, temperature: "warm", assignee: "Paulo" },
  { name: "Bruno", preview: "Obrigado! Até sábado", time: "Ontem", temperature: "warm", tag: { text: "Samba", color: "#a7f3d0" } },
  { name: "Larissa", preview: "Posso levar meu namorado?", time: "Ontem", temperature: "cold" },
  { name: "Thiago", preview: "Qual o endereço da escola?", time: "Ontem", temperature: "cold", assignee: "Paulo" },
  { name: "Fernanda", preview: "Vou ver com meu marido e te aviso", time: "Sábado", temperature: "warm" },
  { name: "Pedro", preview: "Tem aula no sábado de manhã?", time: "Sábado", temperature: "cold", assignee: "Marina" },
];

const TEAM_CHAT: ChatItem[] = [
  { kind: "msg", dir: "in", text: "Vocês dão aula particular? Queria treinar para o meu casamento", time: "18:35" },
  { kind: "msg", dir: "out", by: "ai", text: "Damos sim! Vou chamar alguém da equipe para combinar o horário com você.", time: "18:35" },
  { kind: "note", title: "Passou para a equipe:", body: "aula particular para casamento" },
  { kind: "msg", dir: "out", by: "Marina", text: "Oi, Rafael! Aqui é a Marina. Tenho horário na sexta às 18h, pode ser?", time: "18:42" },
  { kind: "msg", dir: "in", text: "Perfeito, sexta às 18h então!", time: "18:44" },
  { kind: "msg", dir: "out", by: "Marina", text: "Combinado! Te espero na escola.", time: "18:45" },
];

function SlideTeam() {
  return (
    <Slide>
      <TextColumn width={330}>
        <Title>Toda a equipe atende pelo mesmo WhatsApp</Title>
        <Bullets
          items={["Todas as conversas num painel só", "Mais de uma pessoa atendendo, cada uma sabe o que é dela"]}
        />
      </TextColumn>
      <Screen
        designW={700}
        designH={650}
        width={660}
        className={`absolute right-[40px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(650 * (660 / 700)) }}
      >
        <main className="flex h-full gap-3 rounded-[12px] bg-slate-50 p-3">
          <ConversationList />
          <ChatPanel contact="Rafael" items={TEAM_CHAT} ai={false} assignee="Marina" className="min-w-0 flex-1" />
        </main>
      </Screen>
    </Slide>
  );
}

function ConversationList() {
  return (
    <div className="flex w-[250px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-1.5">
        <span className="flex items-center justify-between rounded-[6px] border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
          Todos os Inbox (6)
          <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} className="text-slate-400">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {QUEUE.map((row) => (
          <li
            key={row.name}
            className={[
              "flex items-center gap-2.5 px-2.5 py-2",
              row.active ? "bg-brand-50" : row.unread ? "bg-emerald-50/70" : "bg-white",
            ].join(" ")}
          >
            <ContactAvatar name={row.name} />
            <div className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-1.5">
                {row.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
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
/* Slide 4: disparo para todos                                               */
/* ------------------------------------------------------------------------ */

const STEPS = ["Número", "Audiência", "Mensagem", "Ajustes", "Revisão"];

function SlideBroadcast() {
  return (
    <Slide>
      <TextColumn width={370}>
        <Title>Avise todos os alunos de uma vez</Title>
        <Bullets
          items={[
            "Turma nova, evento, volta às aulas",
            "Escolhe quem recebe: alunos, interessados, quem fez aula experimental",
            "Manda na hora ou agenda o dia",
          ]}
        />
      </TextColumn>
      <Screen
        designW={660}
        designH={560}
        width={630}
        className={`absolute right-[40px] rounded-[12px] ${SCREEN_SHADOW}`}
        style={{ top: vCenter(560 * (630 / 660)) }}
      >
        <BroadcastReview />
      </Screen>
    </Slide>
  );
}

/** Revisão do disparo (disparos/novo/revisar) com a prévia no WhatsApp ao lado. */
function BroadcastReview() {
  return (
    <main className="flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4">
      {/* Etapas do assistente de disparo */}
      <ol className="flex items-center gap-1.5 text-[11px]">
        {STEPS.map((step, i) => {
          const current = i === STEPS.length - 1;
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
              {i < STEPS.length - 1 && <span className="mx-0.5 h-px w-4 bg-slate-200" />}
            </li>
          );
        })}
      </ol>

      <h1 className="mt-4 text-xl font-semibold">Revisar e enviar</h1>

      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <SummaryCard label="Nome do disparo" value="Turma nova de zouk" />
            <SummaryCard label="Audiência" value="Alunos e interessados" />
            <SummaryCard label="Contatos incluídos" value="184" />
            <SummaryCard label="Contatos excluídos" value="7" />
            <SummaryCard label="Envio" value="Seg, 10/11, 10:00" />
            <SummaryCard label="Intervalo" value="5s entre envios" />
          </div>
          <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
            7 contatos não vão receber esta mensagem (pediram para não receber ou telefone inválido).
          </p>
          <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Checklist pré-envio</p>
            <ChecklistRow label="Modelo aprovado" />
            <ChecklistRow label="184 destinatários prontos" />
            <ChecklistRow label="Imagem de cabeçalho anexada" />
          </div>
          <div className="flex justify-end pt-1">
            <span className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white">Agendar para 184 pessoas</span>
          </div>
        </div>

        {/* Prévia no WhatsApp */}
        <div className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-slate-200">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-500">Prévia no WhatsApp</p>
          <div className="mock-chat-bg flex-1 p-3">
            <div className="overflow-hidden rounded-[8px] rounded-tl-none bg-white shadow-sm">
              <div
                className="flex h-[118px] flex-col justify-end p-3 text-white"
                style={{ background: "linear-gradient(135deg, #15803d 0%, #0f766e 55%, #1e293b 100%)" }}
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/75">Matrículas abertas</span>
                <span className="text-[19px] font-bold leading-tight">Turma nova de zouk</span>
                <span className="text-[11px] text-white/85">Quartas, 20h</span>
              </div>
              <p className="px-2.5 py-2 text-[12.5px] leading-snug text-slate-800">
                Oi, Ana! Abrimos uma turma nova de zouk para iniciantes, às quartas, 20h. Quer garantir sua vaga?
                <span className="ml-1.5 text-[10px] text-slate-400">10:00</span>
              </p>
              <p className="border-t border-slate-100 py-1.5 text-center text-[12.5px] font-medium text-sky-600">Quero minha vaga</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-2.5">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function ChecklistRow({ label }: { label: string }) {
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
/* Slide 5: Google e Meta                                                    */
/* ------------------------------------------------------------------------ */

const CAMPAIGNS = [
  { name: "Turma de forró", channel: "Instagram", spend: "R$ 320", people: 41 },
  { name: "Zouk para iniciantes", channel: "Facebook", spend: "R$ 180", people: 19 },
  { name: "Escola de dança perto de mim", channel: "Google", spend: "R$ 250", people: 27 },
  { name: "Volta às aulas", channel: "Instagram", spend: "R$ 210", people: 33 },
  { name: "Aula de samba de gafieira", channel: "Google", spend: "R$ 140", people: 12 },
];

function SlideIntegrations() {
  return (
    <Slide>
      <TextColumn width={380}>
        <Title>Ligado ao Google, ao Instagram e ao Facebook</Title>
        <Bullets
          items={[
            <>
              <span className="font-semibold text-white">Google Agenda:</span> a aula marcada pela assistente já aparece na
              sua agenda
            </>,
            <>
              <span className="font-semibold text-white">Anúncios do Instagram, do Facebook e do Google:</span> mostra de qual
              anúncio veio cada interessado
            </>,
            "Você vê quanto gastou em cada anúncio e quantas pessoas ele trouxe",
          ]}
        />
      </TextColumn>

      {/* Ficha do contato (Interações + Agendamentos) e tabela de campanhas do /roi. */}
      <div
        className="absolute right-[40px] flex flex-col gap-5"
        style={{ width: 640, top: vCenter((275 + 262) * (640 / 600) + 20) }}
      >
        <Screen designW={600} designH={275} width={640} className={`rounded-[12px] ${SCREEN_SHADOW}`}>
          <ContactCard />
        </Screen>
        <Screen designW={600} designH={262} width={640} className={`rounded-[12px] ${SCREEN_SHADOW}`}>
          <CampaignTable />
        </Screen>
      </div>
    </Slide>
  );
}

function ContactCard() {
  return (
    <div className="flex h-full gap-4 overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <ContactAvatar name="Juliana" />
          <div>
            <div className="text-sm font-medium leading-tight">Juliana</div>
            <div className="text-[11px] text-slate-400">+55 11 9•••• ••21</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] font-semibold uppercase text-slate-400">Interações</p>
        <ol className="mt-1.5 space-y-2 border-l border-slate-200 pl-3">
          <TimelineRow
            dot="bg-fuchsia-500"
            title="Clicou no anúncio"
            meta="Anúncio (clique para WhatsApp) · Turma de forró · Instagram"
            time="22:05"
          />
          <TimelineRow dot="bg-sky-500" title="Mandou mensagem" meta="WhatsApp · Escola de dança" time="22:07" />
          <TimelineRow dot="bg-brand-500" title="Agendou" meta="Aula experimental de forró" time="22:09" />
          <TimelineRow dot="bg-amber-500" title="Respondeu a um disparo" meta="Turma nova de zouk" time="Seg 10:12" />
        </ol>
      </div>
      <div className="w-[210px] shrink-0">
        <p className="text-[11px] font-semibold uppercase text-slate-400">Agendamentos</p>
        <div className="mt-1.5 rounded-[8px] border border-slate-200 p-3">
          <div className="text-sm font-medium">Aula experimental</div>
          <div className="text-xs text-slate-500">Quinta, 13/11, 19:00</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Confirmado</span>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              <SparkleIcon className="h-2.5 w-2.5" />
              Marcado pela IA
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-[8px] bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
          <CalendarIcon />
          Também no Google Agenda da escola
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ dot, title, meta, time }: { dot: string; title: string; meta: string; time: string }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[16.5px] top-1.5 h-2 w-2 rounded-full ${dot}`} />
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium">{title}</span>
        <span className="shrink-0 text-[10px] text-slate-400">{time}</span>
      </div>
      <div className="truncate text-[11px] text-slate-500">{meta}</div>
    </li>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} className="shrink-0 text-slate-500">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function CampaignTable() {
  return (
    <div className="h-full overflow-hidden rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">Campanhas</p>
        <span className="rounded-[6px] border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500">30 dias</span>
      </div>
      <table className="mt-2 w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] text-slate-400">
            <th className="py-1.5 font-medium">Campanha</th>
            <th className="py-1.5 font-medium">Canal</th>
            <th className="py-1.5 text-right font-medium">Gasto</th>
            <th className="py-1.5 text-right font-medium">Interessados</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {CAMPAIGNS.map((c) => (
            <tr key={c.name}>
              <td className="py-2 font-medium">{c.name}</td>
              <td className="py-2 text-slate-500">{c.channel}</td>
              <td className="py-2 text-right tabular-nums">{c.spend}</td>
              <td className="py-2 text-right tabular-nums">{c.people}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Slide 6: condição e contato                                               */
/* ------------------------------------------------------------------------ */

function SlideNextStep() {
  return (
    <Slide>
      <TextColumn width={560}>
        <h2 className="text-[60px] font-semibold leading-[1.04] tracking-[-0.025em]">
          Condição especial para escolas de dança
        </h2>
        <p className="mt-12 text-[112px] font-semibold leading-none tracking-[-0.03em] text-brand-400">
          R$ 399
          <span className="ml-4 text-[40px] font-medium tracking-normal text-gray-400">por mês</span>
        </p>
        <p className="mt-4 text-[28px] text-gray-300">para as primeiras escolas</p>
        <p className="mt-12 text-[22px] text-gray-400">Entre em contato</p>
        <p className="mt-1 whitespace-nowrap text-[42px] font-semibold tabular-nums tracking-tight">(11) 98522-3431</p>
        <p className="mt-2 text-[22px] text-gray-400">Guilherme, Sales Flow</p>
      </TextColumn>

      <div className="absolute right-[64px] text-center" style={{ top: vCenter(470) }}>
        <div className="rounded-[32px] bg-white p-7">
          <svg
            viewBox={`-2 -2 ${QR_SIZE + 4} ${QR_SIZE + 4}`}
            width={380}
            height={380}
            shapeRendering="crispEdges"
            aria-label="QR code do WhatsApp do Guilherme"
          >
            <path d={QR_PATH} fill="#0A0C0E" />
          </svg>
        </div>
        <p className="mt-4 text-[18px] text-gray-400">Aponte a câmera para falar no WhatsApp</p>
      </div>
    </Slide>
  );
}
