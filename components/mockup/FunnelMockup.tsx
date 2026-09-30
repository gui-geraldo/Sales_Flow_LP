"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, useFitScale, useTimeline } from "./useMockup";

// Réplica viva da tela /funil da plataforma (auto_agendador, apps/web,
// app/[locale]/(app)/funil/page.tsx): colunas por etapa com contagem e
// total, cartão com contato, título e valor. Os cartões vão como posição
// absoluta em coordenadas da "tela" (não layout animation), porque a tela
// inteira é escalada com transform e o Framer mediria errado.
// Nomes, valores e etapas são fictícios; textos em i18n `funnelMockup`.

// Estreita (4 colunas de 160) pra escalar perto de 1:1 no hero e o texto
// dos cartões ficar legível.
const DESIGN_W = 700;
const PAD = 16;
const COL_W = 160;
const GAP = 9;
const COL_HEAD = 50;
// Nome (20) + título (16) + valor (4 + 16) + padding (20) = 76.
const CARD_H = 78;
const CARD_GAP = 8;
const BOARD_H = COL_HEAD + CARD_GAP + 3 * (CARD_H + CARD_GAP) + 6;
const HEADER_H = 76;
const DESIGN_H = PAD + HEADER_H + BOARD_H + PAD;

type StageKey = "new" | "talking" | "proposal" | "won";
const STAGES: StageKey[] = ["new", "talking", "proposal", "won"];

type Card = { id: string; stage: StageKey; value: number };

// Estado inicial do quadro (ordem dentro da coluna = ordem aqui).
const INITIAL: Card[] = [
  { id: "c1", stage: "new", value: 0 },
  { id: "c2", stage: "new", value: 0 },
  { id: "c3", stage: "talking", value: 1200 },
  { id: "c4", stage: "talking", value: 450 },
  { id: "c5", stage: "proposal", value: 2400 },
  { id: "c6", stage: "won", value: 890 },
];

// Roteiro: a equipe arrasta a Lucía (c3) pra Proposta; depois a proposta
// da Sara (c5) é ganha e o valor entra na coluna "Ganado".
const TIMES = [1300, 2000, 4300, 5000, 5500];
const CYCLE_MS = 9500;

function deriveBoard(count: number) {
  let cards = INITIAL.map((c) => ({ ...c }));
  let lifted: string | null = null;
  let wonBalloon = false;
  const move = (id: string, stage: StageKey) => {
    const card = cards.find((c) => c.id === id)!;
    cards = [...cards.filter((c) => c.id !== id), { ...card, stage }];
  };
  if (count >= 1) lifted = "c3";
  if (count >= 2) {
    move("c3", "proposal");
    lifted = null;
  }
  if (count >= 3) lifted = "c5";
  if (count >= 4) {
    move("c5", "won");
    lifted = null;
  }
  if (count >= 5) wonBalloon = true;
  return { cards, lifted, wonBalloon };
}

// Menor escala em que o texto dos cartões ainda é legível no celular.
const MIN_SCALE = 0.8;

const colX = (i: number) => i * (COL_W + GAP);
const cardY = (row: number) => COL_HEAD + CARD_GAP + row * (CARD_H + CARD_GAP);

export function FunnelMockup({ freezeAt }: { freezeAt?: number }) {
  const t = useTranslations("funnelMockup");
  const { ref, scale: fit } = useFitScale(DESIGN_W);
  const { count, cycle, rootRef } = useTimeline(TIMES, CYCLE_MS, freezeAt);
  const { cards, lifted, wonBalloon } = deriveBoard(count);

  // Celular: 4 colunas espremidas em ~330px ficam ilegíveis. Abaixo de
  // MIN_SCALE o quadro fica nesse tamanho e rola de lado (como o kanban real
  // no celular), e o roteiro leva a rolagem até a coluna onde a ação acontece.
  const scrolling = fit !== null && fit < MIN_SCALE;
  const scale = fit === null ? null : Math.max(fit, MIN_SCALE);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!scrolling || !el || scale === null) return;
    const col = count >= 3 ? 2 : count >= 1 ? 1 : 0;
    el.scrollTo({ left: col === 0 ? 0 : (PAD + colX(col) - 8) * scale, behavior: reduceMotion ? "auto" : "smooth" });
  }, [count, cycle, scrolling, scale, reduceMotion, ref]);

  const money = (value: number) =>
    // useGrouping "always": o es-ES não separa milhar com 4 dígitos ("3600 €").
    value.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" });

  const byStage = (stage: StageKey) => cards.filter((c) => c.stage === stage);

  return (
    <div ref={rootRef}>
      <div
        ref={ref}
        className={`relative w-full ${
          scrolling ? "overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""
        }`}
        style={{ height: scale ? DESIGN_H * scale : undefined, aspectRatio: scale ? undefined : `${DESIGN_W} / ${DESIGN_H}` }}
        aria-hidden
      >
        {scale && (
          // Espaço do tamanho da tela escalada: é o que dá a largura rolável.
          <div className="relative" style={{ width: DESIGN_W * scale, height: DESIGN_H * scale }}>
          <div
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
            <main className="h-full select-none bg-slate-50 font-sans text-slate-900" style={{ padding: PAD }}>
              <div style={{ height: HEADER_H }}>
                {/* <p>, não <h1>: a página já tem o seu H1 (um só por página). */}
                <p className="text-2xl font-semibold">{t("title")}</p>
                <p className="mt-1 text-slate-500">{t("subtitle")}</p>
              </div>

              <div className="relative" style={{ height: BOARD_H }}>
                {/* Colunas (fundo), com contagem e total que acompanham os cartões. */}
                {STAGES.map((stage, i) => {
                  const inStage = byStage(stage);
                  const total = inStage.reduce((sum, c) => sum + c.value, 0);
                  const isWon = stage === "won";
                  return (
                    <div
                      key={stage}
                      className={[
                        "absolute top-0 flex flex-col rounded-[12px] border bg-slate-50 transition-colors duration-500",
                        isWon && wonBalloon ? "border-brand-500 bg-brand-50" : "border-slate-200",
                      ].join(" ")}
                      style={{ left: colX(i), width: COL_W, height: BOARD_H }}
                    >
                      <header className="shrink-0 border-b border-slate-200 px-3 py-2" style={{ height: COL_HEAD }}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {t(`stages.${stage}`)}
                            {isWon && " ✓"}
                          </span>
                          <span className="shrink-0 text-xs text-slate-400">{inStage.length}</span>
                        </div>
                        <div className="h-4 text-xs text-slate-500">
                          <AnimatePresence mode="wait" initial={false}>
                            {total > 0 && (
                              <motion.span
                                key={total}
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.3, ease: EASE_OUT }}
                                className="inline-block"
                              >
                                {money(total)}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </header>
                    </div>
                  );
                })}

                {/* Cartões por cima das colunas, posicionados pela etapa e pela ordem. */}
                {cards.map((card) => {
                  const col = STAGES.indexOf(card.stage);
                  const row = byStage(card.stage).findIndex((c) => c.id === card.id);
                  const isLifted = lifted === card.id;
                  return (
                    <motion.article
                      key={`${card.id}-${cycle}`}
                      initial={false}
                      animate={{
                        x: colX(col) + 8,
                        y: cardY(row),
                        scale: isLifted ? 1.05 : 1,
                        rotate: isLifted ? 1.5 : 0,
                      }}
                      transition={{ duration: 0.65, ease: EASE_OUT }}
                      className={[
                        "absolute left-0 top-0 overflow-hidden rounded-[8px] border bg-white p-2.5 transition-shadow duration-300",
                        isLifted
                          ? "z-20 border-brand-500 shadow-[0_14px_30px_-10px_rgba(15,23,42,0.35)]"
                          : "z-10 border-slate-200 shadow-sm",
                      ].join(" ")}
                      style={{ width: COL_W - 16, height: CARD_H }}
                    >
                      <div className="truncate text-sm font-medium">{t(`cards.${card.id}.name`)}</div>
                      <div className="truncate text-xs text-slate-500">{t(`cards.${card.id}.title`)}</div>
                      {card.value > 0 && (
                        <div className="mt-1 text-xs font-medium text-brand-700">{money(card.value)}</div>
                      )}
                    </motion.article>
                  );
                })}

                {/* Anotação do mockup (não é UI do app): a venda ganha. */}
                <AnimatePresence>
                  {wonBalloon && (
                    <motion.div
                      key={`won-${cycle}`}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="absolute z-30"
                      // ancorado pela direita do quadro: a setinha (right-12) cai na coluna "Ganado"
                      style={{ right: 0, top: cardY(2) + 14 }}
                    >
                      <div className="relative flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-slate-900 px-3 py-2 text-[13px] text-white shadow-[0_10px_28px_-8px_rgba(15,23,42,0.55)]">
                        <span className="absolute -top-1 right-12 h-2.5 w-2.5 rotate-45 bg-slate-900" />
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[11px] text-brand-400">
                          ✓
                        </span>
                        <span>
                          <span className="font-semibold">{t("balloonTitle")}</span>{" "}
                          <span className="text-slate-300">{t("balloonBody", { value: money(2400) })}</span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
