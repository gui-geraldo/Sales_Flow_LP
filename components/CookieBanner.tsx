"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CONSENT_OPEN_EVENT,
  currencyFromCookie,
  saveConsent,
  storedConsent,
  type Consent,
} from "@/lib/consent";
import { isPortugal } from "@/lib/contact";

// Aparece até a pessoa escolher (e de novo pelo link "Cookies" do rodapé).
// Recusar fica tão à mão quanto aceitar, como pede a AEPD.
export function CookieBanner() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [portugal, setPortugal] = useState(false);

  // Só no navegador: depende dos cookies de consentimento e de moeda.
  useEffect(() => {
    setPortugal(isPortugal(locale, currencyFromCookie() ?? ""));
    if (!storedConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [locale]);

  if (!open) return null;
  return (
    <BannerBody
      namespace={portugal ? "cookieBannerPT" : "cookieBanner"}
      onChoose={(consent) => {
        saveConsent(consent);
        setOpen(false);
      }}
    />
  );
}

function BannerBody({
  namespace,
  onChoose,
}: {
  namespace: "cookieBanner" | "cookieBannerPT";
  onChoose: (consent: Consent) => void;
}) {
  const t = useTranslations(namespace);
  const privacyHref = "/privacy";

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl border border-white/10 bg-gray-900/95 p-5 text-sm text-gray-300 shadow-2xl shadow-black/50 backdrop-blur md:left-6 md:right-auto md:mx-0"
    >
      <p className="leading-relaxed">
        {t.rich("text", {
          link: (chunks) => (
            <a href={privacyHref} className="text-gray-100 underline underline-offset-2 hover:text-white">
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="h-10 rounded border border-white/15 px-4 font-semibold text-gray-200 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          {t("reject")}
        </button>
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="h-10 rounded bg-brand-500 px-4 font-semibold text-gray-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}

// Link do rodapé que reabre o banner pra mudar a escolha.
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="text-sm text-gray-400 hover:text-white"
    >
      {label}
    </button>
  );
}
