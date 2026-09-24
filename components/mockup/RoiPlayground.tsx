"use client";

import { useEffect, useState } from "react";
import { RoiMockup } from "./RoiMockup";
import type { RoiPeriod } from "./roi-data";

// Bancada de revisão do mockup de Resultados (só localhost). ?period=7d ou
// ?period=30d trava o período (sem o loop do filtro); sem parâmetro, anima.
export function RoiPlayground() {
  const [period, setPeriod] = useState<RoiPeriod | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("period");
    if (p === "today" || p === "24h" || p === "7d" || p === "30d" || p === "90d") setPeriod(p);
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Localhost · rascunho</p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white">Mockup da tela de Resultados (/roi)</h1>
        <p className="mt-1 text-sm text-gray-400">
          Sem parâmetro: anima e alterna 7 ↔ 30 dias. <code>?period=7d</code> ou <code>?period=30d</code> trava o período.
        </p>
        <div className="mt-8 overflow-hidden rounded-lg border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
          {ready && <RoiMockup staticPeriod={period} />}
        </div>
      </div>
    </main>
  );
}
