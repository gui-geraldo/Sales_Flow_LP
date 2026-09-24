"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlatformMockup } from "./PlatformMockup";
import { CYCLE_MS, STEPS, type Step } from "./script";

// Bancada de revisão do mockup (só localhost): versão grande, versão no
// tamanho da coluna do Hero e o roteiro completo em texto, pra revisar os
// diálogos sem precisar esperar a animação. O idioma segue o da URL
// (/es, /pt, /en).
export function MockupPlayground() {
  const t = useTranslations("mockup");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [runKey, setRunKey] = useState(0);
  // ?t=5 congela a cena em 5s; ?theme=dark abre no tema escuro
  const [freezeAt, setFreezeAt] = useState<number | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const time = params.get("t");
    if (time !== null && !Number.isNaN(Number(time))) setFreezeAt(Number(time) * 1000);
    if (params.get("theme") === "dark") setTheme("dark");
  }, []);

  const steps = [...STEPS].sort((a, b) => a.at - b.at);

  function describe(step: Step) {
    switch (step.type) {
      case "message": {
        const m = step.message;
        if (m.kind === "ai-note") {
          return (
            <span className="text-amber-300">
              Balão entre mensagens: <span className="font-semibold">{t(`notes.${m.id}.title`)}</span>
              <span className="text-amber-200/70"> {t(`notes.${m.id}.body`)}</span>
            </span>
          );
        }
        return (
          <span>
            <span className={m.dir === "in" ? "font-semibold text-sky-300" : "font-semibold text-brand-400"}>
              {m.dir === "in" ? "Paciente" : "IA"}:
            </span>{" "}
            <span className="text-gray-200">
              {m.kind === "audio" ? `🎙️ áudio (${m.duration})` : t(`messages.${m.id}`)}
            </span>
          </span>
        );
      }
      case "temperature":
        return <span className="text-red-300">Classificação → {t(`temperature.${step.value}`)} (lista de conversas)</span>;
      case "tag":
        return <span className="text-gray-400">Etiqueta → {t(`tags.${step.tag.key}`)}</span>;
      case "identified":
        return step.on ? (
          <span className="text-amber-300">
            Balão apontando: <span className="font-semibold">{t("ui.identifiedTitle")}</span> {t("ui.identifiedBody")}
          </span>
        ) : null;
      case "nameSuggestion":
        if (step.state === "shown")
          return (
            <span className="text-amber-300">
              Cartão: <span className="font-semibold">{t("ui.suggestionTitle")}</span> {t("ui.nameField")}{" "}
              {t("contact.capturedName")}
            </span>
          );
        if (step.state === "pressed") return <span className="text-gray-400">Clique em “{t("ui.useThis")}”</span>;
        return null;
      case "nameCaptured":
        return (
          <span className="text-brand-400">
            Nome do contato: {t("contact.initialName")} → {t("contact.capturedName")}
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Localhost · rascunho</p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white">Mockup animado da plataforma</h1>
            <p className="mt-1 text-sm text-gray-400">
              Réplica da tela /inbox, com os mesmos componentes visuais. Ciclo de {Math.round(CYCLE_MS / 1000)}s em loop.
              Idioma: troque /es, /pt ou /en na URL.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded border border-white/10 p-0.5 text-sm">
              {(["light", "dark"] as const).map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTheme(th)}
                  className={[
                    "rounded-sm px-3 py-1.5 font-medium transition-colors",
                    theme === th ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200",
                  ].join(" ")}
                >
                  {th === "dark" ? "Tema escuro" : "Tema claro"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRunKey((k) => k + 1)}
              className="rounded border border-white/10 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/5"
            >
              ↻ Reiniciar
            </button>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-300">Tamanho grande</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
            <PlatformMockup key={`big-${runKey}`} theme={theme} freezeAt={freezeAt} />
          </div>
        </section>

        <section className="mt-12 grid items-start gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-300">No tamanho da coluna do Hero</h2>
            <p className="mt-1 text-xs text-gray-500">Mesma largura do Hero (metade do container).</p>
            <figure className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
              <PlatformMockup key={`hero-${runKey}`} theme={theme} freezeAt={freezeAt} />
            </figure>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-300">
              Roteiro (contato chega como “{t("contact.initialName")}”)
            </h2>
            <ol className="mt-3 space-y-2 text-sm">
              {steps.map((step, i) => {
                const line = describe(step);
                if (!line) return null;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="w-12 shrink-0 tabular-nums text-gray-500">{(step.at / 1000).toFixed(1)}s</span>
                    {line}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
