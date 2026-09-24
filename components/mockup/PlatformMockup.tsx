"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CYCLE_MS, QUEUE, STEPS, type MockMessage, type MockTag, type QueueRow, type Temperature } from "./script";
import { ChevronDownIcon, FilterIcon, MicIcon, PaperclipIcon, PlayIcon, SearchIcon, SmileIcon } from "./icons";

// Réplica viva da tela /inbox da plataforma (auto_agendador, apps/web):
// mesmas classes, cores e estrutura de InboxScreen/MessageList/ContactPanel,
// renderizada num tamanho fixo de "tela de app" e escalada pra caber onde
// for colocada — como um print, só que feito de elementos de verdade e
// animado pelo roteiro em ./script.ts. Sem a sidebar e sem os controles de
// atribuição/telefone do cabeçalho: só o que conta a história. Todo o texto
// vem do i18n (namespace `mockup`), com os rótulos reais da plataforma em
// cada idioma.
//
// Obs.: o tailwind da LP redefine rounded-lg/xl e parte das cores, então os
// raios da plataforma (8px/12px/6px) vão como valores arbitrários.

// "Câmera" fechada: a tela é estreita pra escalar grande (texto legível no
// Hero). Nos primeiros segundos a lista divide espaço com a conversa; depois
// ela sai pela esquerda e a conversa ocupa a largura toda. Alto o bastante
// pra conversa inteira do roteiro caber no chat sem nada sumir por cima.
const DESIGN_W = 760;
const DESIGN_H = 676;
const LIST_W = 320;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Os timers e o "estado no instante t" dependem da ordem cronológica.
const ORDERED_STEPS = [...STEPS].sort((a, b) => a.at - b.at);

type State = {
  messages: MockMessage[];
  typing: boolean;
  temperature: Temperature | null;
  tag: MockTag | null;
  identified: boolean;
  nameSuggestion: "shown" | "pressed" | null;
  nameCaptured: boolean;
  listHidden: boolean;
};

/** Estado + nome do contato já traduzido, que é o que as partes da tela consomem. */
type View = State & { contactName: string };

type T = ReturnType<typeof useTranslations>;

function deriveState(stepCount: number): State {
  const s: State = {
    messages: [],
    typing: false,
    temperature: null,
    tag: null,
    identified: false,
    nameSuggestion: null,
    nameCaptured: false,
    listHidden: false,
  };
  for (const step of ORDERED_STEPS.slice(0, stepCount)) {
    if (step.type === "message") s.messages = [...s.messages, step.message];
    else if (step.type === "typing") s.typing = step.on;
    else if (step.type === "temperature") s.temperature = step.value;
    else if (step.type === "tag") s.tag = step.tag;
    else if (step.type === "identified") s.identified = step.on;
    else if (step.type === "nameSuggestion") s.nameSuggestion = step.state;
    else if (step.type === "nameCaptured") s.nameCaptured = true;
    else if (step.type === "hideList") s.listHidden = true;
  }
  return s;
}

/**
 * Toca o roteiro em loop; com "reduzir movimento" mostra direto o estado
 * final, parado. `freezeAt` (ms) congela a cena naquele instante — usado na
 * bancada de revisão (?t=segundos) pra inspecionar cada momento.
 */
function useScript(freezeAt?: number) {
  const reduceMotion = useReducedMotion();
  const [stepCount, setStepCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (freezeAt !== undefined) {
      setStepCount(ORDERED_STEPS.filter((s) => s.at <= freezeAt).length);
      return;
    }
    if (reduceMotion) {
      setStepCount(ORDERED_STEPS.length);
      return;
    }
    setStepCount(0);
    const timers = ORDERED_STEPS.map((step, i) => setTimeout(() => setStepCount(i + 1), step.at));
    timers.push(setTimeout(() => setCycle((c) => c + 1), CYCLE_MS));
    return () => timers.forEach(clearTimeout);
  }, [cycle, reduceMotion, freezeAt]);

  return { state: deriveState(stepCount), cycle };
}

/** Escala a "tela" de DESIGN_W×DESIGN_H pra largura disponível. */
function useFitScale() {
  const ref = useRef<HTMLDivElement>(null);
  // Guarda só a largura medida; a escala sai dela a cada render — nunca fica
  // presa a um DESIGN_W antigo (ex.: depois de um hot reload).
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // offsetWidth = largura de layout, sem transform: o Hero entra com um
    // scale(0.98)→1, e medir durante essa animação (getBoundingClientRect)
    // deixaria o mockup 2% mais estreito que a moldura pra sempre.
    const update = () => setWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, scale: width ? width / DESIGN_W : null };
}

export function PlatformMockup({
  theme = "light",
  className,
  freezeAt,
}: {
  theme?: "light" | "dark";
  className?: string;
  freezeAt?: number;
}) {
  const t = useTranslations("mockup");
  const { ref, scale } = useFitScale();
  const { state, cycle } = useScript(freezeAt);
  const view: View = {
    ...state,
    contactName: t(state.nameCaptured ? "contact.capturedName" : "contact.initialName"),
  };

  return (
    <div
      ref={ref}
      className={`relative w-full ${className ?? ""}`}
      style={{ height: scale ? DESIGN_H * scale : undefined, aspectRatio: scale ? undefined : `${DESIGN_W} / ${DESIGN_H}` }}
      aria-hidden
    >
      {scale && (
        <div
          className={theme === "dark" ? "dark" : ""}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <main className="relative flex h-full select-none bg-slate-50 p-4 font-sans text-slate-900 dark:bg-slate-950">
            {/* A lista sai deslizando pra esquerda (largura + gap vão a zero),
                abrindo espaço pra conversa. Volta sozinha no início do ciclo. */}
            <motion.div
              initial={false}
              animate={
                view.listHidden
                  ? { width: 0, marginRight: 0, opacity: 0, x: -48 }
                  : { width: LIST_W, marginRight: 16, opacity: 1, x: 0 }
              }
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="flex min-h-0 shrink-0 overflow-hidden"
            >
              <ConversationList view={view} cycle={cycle} t={t} />
            </motion.div>
            <ChatPanel view={view} t={t} />

            {/* Balão apontando pra classificação que a IA acabou de fazer na linha da conversa. */}
            <AnimatePresence>
              {view.identified && (
                <motion.div
                  key={`identified-${cycle}`}
                  initial={{ opacity: 0, x: -8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -4, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="absolute left-[338px] top-[112px] z-20"
                >
                  <PointerBalloon side="left">
                    <span className="whitespace-nowrap text-[13px] leading-snug">
                      <span className="font-semibold">{t("ui.identifiedTitle")}</span>{" "}
                      <span className="text-slate-300">{t("ui.identifiedBody")}</span>
                    </span>
                  </PointerBalloon>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Peças compartilhadas                                                      */
/* ------------------------------------------------------------------------ */

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" className={className}>
      <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Z" />
      <path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8L19 15Z" />
    </svg>
  );
}

/** Balão escuro com setinha — anotação do mockup (não é UI do app). */
function PointerBalloon({ side, children }: { side: "left" | "top"; children: React.ReactNode }) {
  return (
    <div className="relative flex items-center gap-2 rounded-[10px] bg-slate-900 px-3 py-2 text-white shadow-[0_10px_28px_-8px_rgba(15,23,42,0.55)]">
      <span
        className={[
          "absolute h-2.5 w-2.5 rotate-45 bg-slate-900",
          side === "left" ? "-left-1 top-1/2 -translate-y-1/2" : "-top-1 left-6",
        ].join(" ")}
      />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
        <SparkleIcon />
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

const TEMPERATURE_STYLES: Record<Temperature, string> = {
  cold: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  warm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  hot: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  problem: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

function TemperatureBadge({ value, t }: { value: Temperature; t: T }) {
  return (
    <span
      className={[
        "inline-block shrink-0 truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        TEMPERATURE_STYLES[value],
      ].join(" ")}
    >
      {t(`temperature.${value}`)}
    </span>
  );
}

/** Contraste do texto sobre a cor da etiqueta — mesma fórmula do TagPicker da plataforma. */
function textOn(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1e293b" : "#fff";
}

function TagChip({ tag, t }: { tag: MockTag; t: T }) {
  return (
    <span
      className="inline-block shrink-0 truncate rounded-full px-1.5 py-0.5 text-[10px]"
      style={{ backgroundColor: tag.color, color: textOn(tag.color) }}
    >
      {t(`tags.${tag.key}`)}
    </span>
  );
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

function ContactAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
      {initials(name)}
    </span>
  );
}

function AiAvatar() {
  // eslint-disable-next-line @next/next/no-img-element -- arquivo estático em public/
  return <img src="/mockup/ai-avatar.png" alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />;
}

/** Texto que troca com um leve cross-fade (nome do contato quando a sugestão é aceita). */
function SwapText({ text, className }: { text: string; className?: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 4, backgroundColor: "rgba(34,197,94,0.25)" }}
        animate={{ opacity: 1, y: 0, backgroundColor: "rgba(34,197,94,0)" }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35, ease: EASE_OUT, backgroundColor: { duration: 1.4, delay: 0.2 } }}
        className={`-mx-1 rounded px-1 ${className ?? ""}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------------ */
/* Lista de conversas                                                        */
/* ------------------------------------------------------------------------ */

/** Linha já com os textos resolvidos — a do contato ativo é montada a partir da conversa. */
type RowView = QueueRow & { name: string; preview: string };

function ConversationList({ view, cycle, t }: { view: View; cycle: number; t: T }) {
  const lastReal = [...view.messages].reverse().find((m) => m.kind !== "ai-note");
  const active: RowView | null = lastReal
    ? {
        id: "active",
        name: view.contactName,
        preview: lastReal.kind === "audio" ? t("ui.audio") : t(`messages.${lastReal.id}`),
        previewType: lastReal.kind === "audio" ? "audio" : undefined,
        previewOut: lastReal.dir === "out",
        time: lastReal.time,
        temperature: view.temperature,
        tag: view.tag ?? undefined,
        unread: lastReal.dir === "in",
      }
    : null;

  return (
    <div className="flex min-h-0 w-80 shrink-0 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1.5 border-b border-slate-200 bg-white/95 p-1.5 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-1.5">
          <div className="relative flex flex-1 items-center">
            <SearchIcon className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-slate-400" />
            <span className="w-full rounded-[6px] border border-slate-200 bg-white py-1 pl-7 pr-2 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              {t("ui.search")}
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-[6px] border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <FilterIcon className="h-3.5 w-3.5" />
            {t("ui.filters")}
          </span>
        </div>
        <span className="flex items-center justify-between rounded-[6px] border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {t("ui.allInboxes", { count: (active?.unread ? 1 : 0) + 1 })}
          <ChevronDownIcon className="text-slate-400" />
        </span>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-hidden dark:divide-slate-800">
        <AnimatePresence initial={false}>
          {active && (
            <motion.li
              key={`active-${cycle}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <Row row={active} active highlight={view.identified} t={t} />
            </motion.li>
          )}
        </AnimatePresence>
        {QUEUE.map((row) => (
          <li key={row.id}>
            <Row row={{ ...row, name: t(`queue.${row.id}.name`), preview: t(`queue.${row.id}.preview`) }} t={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ row, active, highlight, t }: { row: RowView; active?: boolean; highlight?: boolean; t: T }) {
  return (
    <div
      className={[
        "flex w-full items-center gap-3 px-3 py-2.5 text-left",
        active
          ? "bg-brand-50 dark:bg-brand-500/10"
          : row.unread
            ? "bg-emerald-50/70 dark:bg-sky-500/10"
            : "bg-white dark:bg-slate-900",
      ].join(" ")}
    >
      <ContactAvatar name={row.name} />
      <div className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-1.5">
          {row.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />}
          <span
            className={[
              "block min-w-0 truncate text-sm",
              row.unread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-100",
            ].join(" ")}
          >
            {active ? <SwapText text={row.name} /> : row.name}
          </span>
        </span>
        <span
          className={[
            "flex min-w-0 items-center gap-1 truncate text-xs",
            row.unread ? "font-semibold text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
          ].join(" ")}
        >
          {row.previewOut && "↩ "}
          {row.previewType === "audio" && <MicIcon className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate">{row.preview}</span>
        </span>
        <div className="mt-1 flex items-end justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">{t("ui.inbox")}</span>
            <AnimatePresence initial={false}>
              {row.tag && (
                <motion.span
                  key={row.tag.key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: highlight ? 1.12 : 1 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                  className={[
                    "flex rounded-full transition-shadow duration-500",
                    highlight ? "shadow-[0_0_0_3px_rgba(6,182,212,0.3)]" : "",
                  ].join(" ")}
                >
                  <TagChip tag={row.tag} t={t} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="flex shrink-0 flex-col items-end gap-0.5">
            <AnimatePresence initial={false}>
              {row.temperature && (
                <motion.span
                  key={row.temperature}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: highlight ? 1.15 : 1 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                  className={[
                    "flex origin-right rounded-full transition-shadow duration-500",
                    highlight ? "shadow-[0_0_0_3px_rgba(239,68,68,0.35)]" : "",
                  ].join(" ")}
                >
                  <TemperatureBadge value={row.temperature} t={t} />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {row.time === "yesterday" ? t("ui.yesterday") : row.time}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Conversa                                                                  */
/* ------------------------------------------------------------------------ */

function ChatPanel({ view, t }: { view: View; t: T }) {
  const open = view.messages.length > 0;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {!open ? (
        <p className="p-4 text-sm text-slate-500 dark:text-slate-400">{t("ui.selectConversation")}</p>
      ) : (
        <>
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-0 items-center gap-2 px-1 py-0.5">
              <ContactAvatar name={view.contactName} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium leading-tight dark:text-slate-100">
                  <SwapText text={view.contactName} />
                </div>
                <div className="truncate text-[11px] uppercase text-slate-400 dark:text-slate-500">{t("ui.inbox")}</div>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-green-600 bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              {t("ui.aiOn")}
            </span>
          </header>

          <div className="mock-chat-bg flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 py-3">
            <div className="flex justify-center py-1.5">
              <span className="rounded-[8px] bg-white/80 px-3 py-1 text-[11px] text-slate-500 shadow-sm dark:bg-slate-900/80 dark:text-slate-400">
                {t("ui.today")}
              </span>
            </div>
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {view.messages.map((m, i) => {
                  if (m.kind === "ai-note") return <AiNote key={m.id} note={m} t={t} />;
                  const prev = view.messages.slice(0, i).reverse().find((p) => p.kind !== "ai-note");
                  const startsGroup = !prev || prev.dir !== m.dir;
                  return (
                    <MessageRow key={m.id} message={m} startsGroup={startsGroup} contactName={view.contactName} t={t} />
                  );
                })}
                {view.typing && <TypingRow key="typing" />}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 dark:text-slate-400">
              <SmileIcon className="h-5 w-5" />
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 dark:text-slate-400">
              <PaperclipIcon className="h-5 w-5" />
            </span>
            <span className="flex min-h-[2.5rem] flex-1 items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
              {t("ui.composer")}
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
              <MicIcon className="h-5 w-5" />
            </span>
          </div>

          <AnimatePresence>
            {view.nameSuggestion && (
              <NameSuggestion key="suggestion" pressed={view.nameSuggestion === "pressed"} t={t} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

/**
 * Cartão real da ficha do contato ("A IA captou algo diferente"), trazido
 * pra perto do nome com uma setinha — mesmas cores/textos do ContactPanel,
 * compactado numa linha só.
 */
function NameSuggestion({ pressed, t }: { pressed: boolean; t: T }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      style={{ transformOrigin: "top left" }}
      className="absolute left-3 top-[58px] z-20"
    >
      <span className="absolute -top-1 left-6 h-2.5 w-2.5 rotate-45 border-l border-t border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950" />
      <section className="flex items-center gap-2.5 whitespace-nowrap rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm shadow-[0_10px_28px_-10px_rgba(15,23,42,0.35)] dark:border-amber-900 dark:bg-amber-950">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">
          <SparkleIcon className="h-3 w-3" />
          {t("ui.suggestionTitle")}
        </span>
        <span>
          <span className="text-slate-500 dark:text-slate-400">{t("ui.nameField")} </span>
          <span className="font-medium dark:text-slate-100">{t("contact.capturedName")}</span>
        </span>
        <motion.span
          animate={pressed ? { scale: [1, 0.92, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className={[
            "rounded px-2 py-0.5 text-xs text-white transition-colors",
            pressed ? "bg-amber-700 ring-2 ring-amber-300" : "bg-amber-600",
          ].join(" ")}
        >
          {t("ui.useThis")}
        </motion.span>
      </section>
    </motion.div>
  );
}

const bubbleEnter = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
  transition: { duration: 0.35, ease: EASE_OUT },
};

function MessageRow({
  message: m,
  startsGroup,
  contactName,
  t,
}: {
  message: Exclude<MockMessage, { kind: "ai-note" }>;
  startsGroup: boolean;
  contactName: string;
  t: T;
}) {
  const mine = m.dir === "out";
  return (
    <motion.div
      layout="position"
      {...bubbleEnter}
      style={{ transformOrigin: mine ? "bottom right" : "bottom left" }}
      className={["flex min-w-0 items-end gap-2", mine ? "justify-end" : "justify-start", startsGroup ? "mt-2" : ""].join(" ")}
    >
      {!mine && (startsGroup ? <ContactAvatar name={contactName} /> : <span className="w-7 shrink-0" />)}
      <div
        className={[
          "relative min-w-0 max-w-[75%] rounded-[8px] px-2.5 py-1.5 text-sm shadow-sm",
          mine ? "bg-[#d9fdd3] text-slate-800" : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100",
          startsGroup && mine ? "rounded-tr-none" : "",
          startsGroup && !mine ? "rounded-tl-none" : "",
        ].join(" ")}
      >
        {m.kind === "audio" ? (
          <AudioBody duration={m.duration} />
        ) : (
          <span className="whitespace-pre-wrap break-words">{t(`messages.${m.id}`)}</span>
        )}
        <span className="ml-2 inline-block translate-y-0.5 whitespace-nowrap text-[10px] text-slate-400">
          {m.time}
          {mine && <span className="ml-1 text-[10px] text-sky-500">✓✓</span>}
        </span>
      </div>
      {mine && (startsGroup ? <AiAvatar /> : <span className="w-7 shrink-0" />)}
    </motion.div>
  );
}

/** Balãozinho da IA entre as mensagens — anotação do mockup, centralizada como o chip de data. */
function AiNote({ note, t }: { note: Extract<MockMessage, { kind: "ai-note" }>; t: T }) {
  const tone =
    note.icon === "check"
      ? "bg-brand-500/20 text-brand-400"
      : note.icon === "audio"
        ? "bg-sky-400/20 text-sky-300"
        : "bg-amber-400/20 text-amber-300";
  return (
    <motion.div layout="position" {...bubbleEnter} className="flex justify-center py-1">
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-900 py-1 pl-1 pr-3 text-[12px] leading-snug text-white shadow-[0_8px_22px_-8px_rgba(15,23,42,0.5)]">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${tone}`}>
          {note.icon === "audio" ? <MicIcon className="h-3 w-3" /> : note.icon === "check" ? "✓" : <SparkleIcon className="h-3 w-3" />}
        </span>
        <span>
          <span className="font-semibold">{t(`notes.${note.id}.title`)}</span>
          <span className="text-slate-300"> {t(`notes.${note.id}.body`)}</span>
        </span>
      </span>
    </motion.div>
  );
}

// Alturas fixas (não aleatórias) — o mesmo "desenho" de onda em todo ciclo.
const WAVE = [6, 10, 14, 9, 16, 20, 12, 8, 15, 22, 18, 11, 7, 13, 19, 16, 10, 6, 12, 17, 21, 14, 9, 7, 11, 15, 10, 6];

function AudioBody({ duration }: { duration: string }) {
  const bars = (color: string) => (
    <span className="flex h-6 items-center gap-[2px]">
      {WAVE.map((h, i) => (
        <span key={i} className={`w-[2px] shrink-0 rounded-full ${color}`} style={{ height: h }} />
      ))}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-2.5 py-0.5 align-middle">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
        <PlayIcon className="translate-x-[1px]" />
      </span>
      <span className="relative">
        {bars("bg-slate-300 dark:bg-slate-600")}
        {/* "tocando": a parte já ouvida pinta de verde enquanto a IA escuta */}
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, delay: 0.3, ease: "linear" }}
          className="absolute inset-y-0 left-0 overflow-hidden"
        >
          {bars("bg-brand-500")}
        </motion.span>
      </span>
      <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">{duration}</span>
    </span>
  );
}

function TypingRow() {
  return (
    <motion.div layout="position" {...bubbleEnter} style={{ transformOrigin: "bottom right" }} className="mt-2 flex items-end justify-end gap-2">
      <div className="flex items-center gap-1 rounded-[8px] rounded-tr-none bg-[#d9fdd3] px-3 py-2.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-500"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <AiAvatar />
    </motion.div>
  );
}
