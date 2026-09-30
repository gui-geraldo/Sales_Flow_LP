"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { MicIcon, PaperclipIcon, SmileIcon } from "./icons";
import { EASE_OUT, initials, useFitScale, useTimeline } from "./useMockup";

// Réplica viva de uma conversa da /inbox com a operação multiagente da
// plataforma (auto_agendador): o seletor "Asignado a:" do cabeçalho, o nome
// de quem respondeu no balão, a nota interna em amarelo e os modos
// Responder / Nota interna / Programar do campo de mensagem. Mesmas
// classes do InboxScreen e do MessageList. Roteiro: a conversa chega sem
// responsável, a Marta assume, deixa uma nota e passa pro Carlos no turno
// da tarde, que continua com o histórico. Textos em i18n `teamMockup`.

const DESIGN_W = 760;
const DESIGN_H = 590;
// Mais estreita no celular, os balões quebram em mais linhas: um pouco mais alta.
const DESIGN_H_NARROW = 640;

type Msg =
  | { id: string; kind: "in"; time: string }
  | { id: string; kind: "out"; agent: "marta" | "carlos"; time: string }
  | { id: string; kind: "note"; agent: "marta"; time: string };

type Step =
  | { type: "message"; message: Msg }
  | { type: "assign"; to: "marta" | "carlos" }
  | { type: "mode"; mode: "reply" | "note" }
  | { type: "balloon"; key: "assigned" | "handover" | null };

const SCRIPT: { at: number; step: Step }[] = [
  { at: 600, step: { type: "message", message: { id: "m1", kind: "in", time: "09:12" } } },
  { at: 1700, step: { type: "assign", to: "marta" } },
  { at: 1750, step: { type: "balloon", key: "assigned" } },
  { at: 3000, step: { type: "message", message: { id: "m2", kind: "out", agent: "marta", time: "09:14" } } },
  { at: 3200, step: { type: "balloon", key: null } },
  { at: 4300, step: { type: "message", message: { id: "m3", kind: "in", time: "09:20" } } },
  { at: 5500, step: { type: "mode", mode: "note" } },
  { at: 6300, step: { type: "message", message: { id: "n1", kind: "note", agent: "marta", time: "14:58" } } },
  { at: 7300, step: { type: "assign", to: "carlos" } },
  { at: 7350, step: { type: "mode", mode: "reply" } },
  { at: 7400, step: { type: "balloon", key: "handover" } },
  { at: 8800, step: { type: "message", message: { id: "m4", kind: "in", time: "17:05" } } },
  { at: 10000, step: { type: "message", message: { id: "m5", kind: "out", agent: "carlos", time: "17:06" } } },
  { at: 10200, step: { type: "balloon", key: null } },
];
const TIMES = SCRIPT.map((s) => s.at);
const CYCLE_MS = 14000;

type State = {
  messages: Msg[];
  assignee: "marta" | "carlos" | null;
  mode: "reply" | "note";
  balloon: "assigned" | "handover" | null;
};

function deriveState(count: number): State {
  const s: State = { messages: [], assignee: null, mode: "reply", balloon: null };
  for (const { step } of SCRIPT.slice(0, count)) {
    if (step.type === "message") s.messages = [...s.messages, step.message];
    else if (step.type === "assign") s.assignee = step.to;
    else if (step.type === "mode") s.mode = step.mode;
    else if (step.type === "balloon") s.balloon = step.key;
  }
  return s;
}

type T = ReturnType<typeof useTranslations>;

export function TeamMockup({ freezeAt }: { freezeAt?: number }) {
  const t = useTranslations("teamMockup");
  // No celular a conversa é desenhada com 420px (como o chat real no
  // celular), e não encolhida a partir de 760px.
  const { ref, scale, designW, isNarrow } = useFitScale(DESIGN_W, { below: 560, designW: 420 });
  const designH = isNarrow ? DESIGN_H_NARROW : DESIGN_H;
  const { count, cycle, rootRef } = useTimeline(TIMES, CYCLE_MS, freezeAt);
  const state = deriveState(count);
  const contact = t("contact");

  return (
    <div ref={rootRef}>
      <div
        ref={ref}
        className="relative w-full"
        style={{ height: scale ? designH * scale : undefined, aspectRatio: scale ? undefined : `${DESIGN_W} / ${DESIGN_H}` }}
        aria-hidden
      >
        {scale && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: designW,
              height: designH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <main className="relative flex h-full select-none bg-slate-50 p-4 font-sans text-slate-900">
              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
                <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2 px-1 py-0.5">
                    <Avatar name={contact} tone="contact" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium leading-tight">{contact}</div>
                      <div className="truncate text-[11px] uppercase text-slate-400">{t("inbox")}</div>
                    </div>
                  </div>

                  {/* Seletor real do cabeçalho: "Asignado a:" + lista da equipe. */}
                  <label className="flex shrink-0 flex-col items-stretch gap-0.5 text-center text-[11px] text-slate-500">
                    {t("assignedTo")}
                    <motion.span
                      key={`${state.assignee}-${cycle}`}
                      initial={state.assignee ? { scale: 0.92, boxShadow: "0 0 0 4px rgba(34,197,94,0.35)" } : false}
                      animate={{ scale: 1, boxShadow: "0 0 0 0px rgba(34,197,94,0)" }}
                      transition={{ duration: 0.9, ease: EASE_OUT }}
                      className="flex min-w-[120px] items-center justify-between gap-2 rounded-[8px] border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                    >
                      {state.assignee ? t(`agents.${state.assignee}`) : t("nobody")}
                      <svg viewBox="0 0 12 12" width={10} height={10} className="text-slate-400" aria-hidden>
                        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </label>
                </header>

                <div className="mock-chat-bg flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 py-3">
                  <div className="flex justify-center py-1.5">
                    <span className="rounded-[8px] bg-white/80 px-3 py-1 text-[11px] text-slate-500 shadow-sm">
                      {t("today")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <AnimatePresence initial={false}>
                      {state.messages.map((m, i) => (
                        <MessageRow key={`${m.id}-${cycle}`} message={m} prev={state.messages[i - 1]} contact={contact} t={t} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <Composer mode={state.mode} t={t} />
              </div>

              {/* Anotação do mockup (não é UI do app), apontando pro seletor. */}
              <AnimatePresence>
                {state.balloon && (
                  <motion.div
                    key={`${state.balloon}-${cycle}`}
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    style={{ transformOrigin: "top right" }}
                    className="absolute right-6 top-[78px] z-20"
                  >
                    <div className="relative flex max-w-[340px] items-center gap-2 rounded-[10px] bg-slate-900 px-3 py-2 text-[13px] leading-snug text-white shadow-[0_10px_28px_-8px_rgba(15,23,42,0.55)]">
                      <span className="absolute -top-1 right-14 h-2.5 w-2.5 rotate-45 bg-slate-900" />
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[11px] text-brand-400">
                        ✓
                      </span>
                      <span>
                        <span className="font-semibold">{t(`balloons.${state.balloon}.title`)}</span>{" "}
                        <span className="text-slate-300">{t(`balloons.${state.balloon}.body`)}</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, tone }: { name: string; tone: "contact" | "agent" }) {
  return (
    <span
      className={[
        "flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold",
        tone === "contact" ? "bg-slate-300 text-slate-700" : "bg-brand-100 text-brand-700",
      ].join(" ")}
    >
      {initials(name)}
    </span>
  );
}

const bubbleEnter = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
  transition: { duration: 0.35, ease: EASE_OUT },
};

function MessageRow({ message: m, prev, contact, t }: { message: Msg; prev?: Msg; contact: string; t: T }) {
  if (m.kind === "note") {
    // Nota interna: mesmo cartão amarelo do MessageList ("Nota interna · autor").
    return (
      <motion.div layout="position" {...bubbleEnter}>
        <div className="my-1.5 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900">
          <div className="mb-0.5 text-[11px] font-semibold uppercase text-amber-600">
            {t("noteLabel")} · {t(`agents.${m.agent}`)}
          </div>
          <span className="whitespace-pre-wrap break-words">{t(`messages.${m.id}`)}</span>
          <span className="ml-2 text-[10px] text-amber-500">{m.time}</span>
        </div>
      </motion.div>
    );
  }

  const mine = m.kind === "out";
  const sameAuthor = prev && prev.kind === m.kind && (prev.kind !== "out" || (m.kind === "out" && prev.agent === m.agent));
  const startsGroup = !sameAuthor;
  const agentName = m.kind === "out" ? t(`agents.${m.agent}`) : "";

  return (
    <motion.div
      layout="position"
      {...bubbleEnter}
      style={{ transformOrigin: mine ? "bottom right" : "bottom left" }}
      className={["flex min-w-0 items-end gap-2", mine ? "justify-end" : "justify-start", startsGroup ? "mt-2" : ""].join(" ")}
    >
      {!mine && (startsGroup ? <Avatar name={contact} tone="contact" /> : <span className="w-7 shrink-0" />)}
      <div
        className={[
          "relative min-w-0 max-w-[75%] rounded-[8px] px-2.5 py-1.5 text-sm shadow-sm",
          mine ? "bg-[#d9fdd3] text-slate-800" : "bg-white text-slate-800",
          startsGroup && mine ? "rounded-tr-none" : "",
          startsGroup && !mine ? "rounded-tl-none" : "",
        ].join(" ")}
      >
        {mine && startsGroup && <div className="mb-0.5 text-[11px] font-semibold text-brand-700">{agentName}</div>}
        <span className="whitespace-pre-wrap break-words">{t(`messages.${m.id}`)}</span>
        <span className="ml-2 inline-block translate-y-0.5 whitespace-nowrap text-[10px] text-slate-400">
          {m.time}
          {mine && <span className="ml-1 text-[10px] text-sky-500">✓✓</span>}
        </span>
      </div>
      {mine && (startsGroup ? <Avatar name={agentName} tone="agent" /> : <span className="w-7 shrink-0" />)}
    </motion.div>
  );
}

/** Campo de mensagem com os três modos reais; em "Nota interna" fica amarelo. */
function Composer({ mode, t }: { mode: "reply" | "note"; t: T }) {
  const note = mode === "note";
  const chip = (active: boolean, activeClass: string) =>
    ["rounded-full px-3 py-1 font-medium transition-colors duration-300", active ? activeClass : "text-slate-500"].join(" ");

  return (
    <div className="border-t border-slate-200 bg-white p-3">
      <div className="mb-2 flex gap-1 text-xs">
        <span className={chip(!note, "bg-brand-600 text-white")}>{t("modes.reply")}</span>
        <span className={chip(note, "bg-amber-500 text-white")}>{t("modes.note")}</span>
        <span className={chip(false, "")}>{t("modes.schedule")}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500">
          <SmileIcon className="h-5 w-5" />
        </span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500">
          <PaperclipIcon className="h-5 w-5" />
        </span>
        <span
          className={[
            "flex min-h-[2.5rem] flex-1 items-center rounded-2xl border px-4 py-2 text-sm shadow-sm transition-colors duration-300",
            note ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-400",
          ].join(" ")}
        >
          {note ? t("notePlaceholder") : t("composer")}
        </span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <MicIcon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
