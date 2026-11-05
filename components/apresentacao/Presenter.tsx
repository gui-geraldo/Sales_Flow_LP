"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Modo apresentação para as páginas de slides (/p/...): botão "Apresentar"
// põe a página em tela cheia, um slide por vez, ampliado para caber na tela,
// e passa de slide deslizando para o lado. Teclas: → ↓ espaço PageDown
// (avança), ← ↑ PageUp (volta), Home/End, Esc (sai). Clique na metade
// direita avança, na esquerda volta; rolagem do mouse também passa.
// Não mexe no PDF: o botão some na impressão e, fora do modo, a página é a
// mesma coluna de slides de sempre.

const W = 1123;
const H = 794;

export function Presenter({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [scale, setScale] = useState(1);
  const wheelLock = useRef(0);

  const slidesEl = () => rootRef.current?.querySelector<HTMLElement>(".slides") ?? null;

  useEffect(() => {
    setCount(rootRef.current?.querySelectorAll(".slide").length ?? 0);
  }, []);

  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(count - 1, next))),
    [count],
  );

  const start = useCallback(() => {
    // Começa no slide que está mais visível na tela.
    const slides = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".slide") ?? []);
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.getBoundingClientRect().top);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
    setOn(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    setOn(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }, []);

  // Fileira horizontal de slides, deslocada até o slide atual.
  useEffect(() => {
    const el = slidesEl();
    if (!el) return;
    if (!on) {
      el.style.cssText = "";
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.cssText = [
      "display:flex",
      "flex-direction:row",
      "align-items:flex-start",
      "gap:0",
      "padding:0",
      `width:${W * count}px`,
      `transform:translateX(${-index * W}px)`,
      reduce ? "transition:none" : "transition:transform 450ms cubic-bezier(0.22,1,0.36,1)",
    ].join(";");
  }, [on, index, count]);

  // Escala para caber na tela.
  useEffect(() => {
    if (!on) return;
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [on]);

  // Saiu da tela cheia (Esc do navegador): sai do modo também.
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setOn(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) go(index + 1);
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) go(index - 1);
      else if (k === "Home") go(0);
      else if (k === "End") go(count - 1);
      else if (k === "Escape") stop();
      else return;
      e.preventDefault();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8 || now - wheelLock.current < 650) return;
      wheelLock.current = now;
      go(index + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [on, index, count, go, stop]);

  return (
    <>
      <div
        className={on ? "fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden bg-black" : ""}
        onClick={
          on
            ? (e) => {
                const half = window.innerWidth / 2;
                go(index + (e.clientX >= half ? 1 : -1));
              }
            : undefined
        }
      >
        <div
          className={on ? "shrink-0 overflow-hidden" : ""}
          style={on ? { width: W * scale, height: H * scale } : undefined}
        >
          <div
            ref={rootRef}
            style={on ? { width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}
          >
            {children}
          </div>
        </div>
      </div>

      {on ? (
        <div className="pointer-events-none fixed bottom-3 right-4 z-[60] text-[13px] tabular-nums text-white/35">
          {index + 1} / {count}
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)] transition-transform hover:bg-brand-500 active:scale-[0.97] print:hidden"
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
          Apresentar
        </button>
      )}
    </>
  );
}
