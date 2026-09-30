"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Peças comuns dos mockups novos (FunnelMockup, TeamMockup): mesma lógica
// do PlatformMockup, separada pra não repetir em cada tela.

/** Escala a "tela" de largura fixa (designW) pra largura disponível. */
export function useFitScale(designW: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // offsetWidth (largura de layout, sem transform): medir durante a entrada
    // animada com scale deixaria o mockup menor que a moldura.
    const update = () => setWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, scale: width ? width / designW : null };
}

/**
 * Toca um roteiro em loop: `times` são os instantes (ms) de cada passo, em
 * ordem; devolve quantos passos já aconteceram. Com "reduzir movimento" vai
 * direto ao fim, parado. `freezeAt` (ms) congela num instante.
 * Só começa quando a tela entra na viewport, pra ninguém perder o início.
 */
export function useTimeline(times: number[], cycleMs: number, freezeAt?: number) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (freezeAt !== undefined) {
      setCount(times.filter((at) => at <= freezeAt).length);
      return;
    }
    if (reduceMotion) {
      setCount(times.length);
      return;
    }
    if (!visible) return;
    setCount(0);
    const timers = times.map((at, i) => setTimeout(() => setCount(i + 1), at));
    timers.push(setTimeout(() => setCycle((c) => c + 1), cycleMs));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `times` é constante do módulo
  }, [cycle, reduceMotion, freezeAt, visible, cycleMs]);

  return { count, cycle, rootRef };
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}
