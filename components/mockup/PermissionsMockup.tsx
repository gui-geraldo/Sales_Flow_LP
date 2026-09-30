"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT, useFitScale, useTimeline } from "./useMockup";

// Réplica da tabela "Perfiles y permisos" (auto_agendador, apps/web,
// components/settings/PermissionsSection.tsx) com os valores padrão reais
// de cada perfil (apps/api/src/auth/permission-catalog.ts). No roteiro, o
// Administrador libera "Envíos masivos" para o perfil Agente e a célula
// ganha o aviso "modificado", como na tela real. Textos em `permissionsMockup`.

const DESIGN_W = 680;
// Altura inicial (antes de medir); depois vale a altura real do conteúdo.
const DESIGN_H = 600;

type Feature = "crm" | "ai_edit" | "broadcasts" | "automations" | "sales_ads" | "billing" | "integrations" | "team";

// Padrão por perfil editável (Gerente, Agente). O Administrador tem tudo.
const DEFAULTS: { key: Feature; manager: boolean; agent: boolean; locked?: boolean }[] = [
  { key: "crm", manager: true, agent: true },
  { key: "ai_edit", manager: true, agent: false },
  { key: "broadcasts", manager: true, agent: false },
  { key: "automations", manager: true, agent: false },
  { key: "sales_ads", manager: true, agent: false },
  { key: "billing", manager: false, agent: false },
  { key: "integrations", manager: false, agent: false },
  { key: "team", manager: false, agent: false, locked: true },
];

const TIMES = [1600];
const CYCLE_MS = 6500;

export function PermissionsMockup({ freezeAt }: { freezeAt?: number }) {
  const t = useTranslations("permissionsMockup");
  const { ref, scale } = useFitScale(DESIGN_W);
  const { count, cycle, rootRef } = useTimeline(TIMES, CYCLE_MS, freezeAt);
  const toggled = count >= 1;
  // A tabela tem altura de conteúdo: mede a "tela" sem escala (offsetHeight
  // ignora o transform) pra moldura não cortar nem sobrar espaço.
  const innerRef = useRef<HTMLElement>(null);
  const [designH, setDesignH] = useState(DESIGN_H);
  useLayoutEffect(() => {
    if (innerRef.current) setDesignH(innerRef.current.offsetHeight);
  }, [scale]);

  return (
    <div ref={rootRef}>
      <div
        ref={ref}
        className="relative w-full"
        style={{ height: scale ? designH * scale : undefined, aspectRatio: scale ? undefined : `${DESIGN_W} / ${designH}` }}
        aria-hidden
      >
        {scale && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: DESIGN_W,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <main ref={innerRef} className="select-none bg-slate-50 p-4 font-sans text-slate-900">
              <div className="rounded-[12px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-lg font-medium">{t("title")}</p>
                <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

                <table className="mt-5 w-full text-sm">
                  <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-2 pr-4 font-medium">{t("feature")}</th>
                      <th className="px-3 py-2 text-center font-medium">{t("roles.admin")}</th>
                      <th className="px-3 py-2 text-center font-medium">{t("roles.manager")}</th>
                      <th className="px-3 py-2 text-center font-medium">{t("roles.agent")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DEFAULTS.map((f) => {
                      const changed = toggled && f.key === "broadcasts";
                      const agent = changed ? true : f.agent;
                      return (
                        <tr key={f.key}>
                          <td className="py-2.5 pr-4">
                            <div className="font-medium">{t(`features.${f.key}`)}</div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <Box checked disabled />
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <Box checked={f.manager} disabled={f.locked} />
                          </td>
                          <td className="px-3 pt-2.5 text-center">
                            <motion.span
                              key={`${f.key}-${cycle}-${changed}`}
                              initial={changed ? { scale: 0.7 } : false}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.45, bounce: 0.5 }}
                              className="inline-flex"
                            >
                              <Box checked={agent} disabled={f.locked} ring={changed} />
                            </motion.span>
                            {/* Espaço fixo pro aviso "modificado" (como na tela real, abaixo
                                da caixa), pra linha não pular de altura quando ele aparece. */}
                            <div className="h-3.5 text-[10px] leading-[14px] text-brand-600">
                              <AnimatePresence>
                                {changed && (
                                  <motion.span
                                    initial={{ opacity: 0, y: -2 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: EASE_OUT }}
                                    className="inline-block"
                                  >
                                    {t("changed")}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <p className="mt-5 text-xs text-slate-500">{t("alwaysOn")}</p>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

/** Checkbox da tabela real (accent-brand-600), desenhado pra não ser clicável. */
function Box({ checked, disabled, ring }: { checked: boolean; disabled?: boolean; ring?: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-4 w-4 items-center justify-center rounded-[3px] border transition-colors duration-300",
        checked ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white",
        disabled ? "opacity-50" : "",
        ring ? "shadow-[0_0_0_4px_rgba(34,197,94,0.25)]" : "",
      ].join(" ")}
    >
      {checked && (
        <svg viewBox="0 0 12 12" width={10} height={10} aria-hidden>
          <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
