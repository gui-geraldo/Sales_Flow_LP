"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  clearLeadTracking,
  collectLeadContext,
  initLeadTracking,
  startEngagementTracking,
  type LeadIntent,
} from "@/lib/lead";
import { isPortugal, whatsappUrl } from "@/lib/contact";
import { CONSENT_EVENT, hasConsent, type Consent } from "@/lib/consent";
import { normalizePhone } from "@/lib/phone";
import { trackLeadFormOpen, trackLeadSubmit } from "@/lib/track";

// Em todas as moedas, toda saída de contato (botões de demo, preço e o botão
// flutuante de WhatsApp) abre este formulário curto antes do WhatsApp,
// no mesmo formato do widget da plataforma usado na dentistaon.

type LeadApi = {
  enabled: boolean;
  open: (intent: LeadIntent, source: string) => void;
};

const LeadCtx = createContext<LeadApi>({ enabled: false, open: () => {} });

export function useLead() {
  return useContext(LeadCtx);
}

export function LeadProvider({
  enabled,
  locale,
  currency,
  children,
}: {
  enabled: boolean;
  locale: string;
  currency: string;
  children: React.ReactNode;
}) {
  const [request, setRequest] = useState<{ intent: LeadIntent; source: string } | null>(null);

  // A origem da visita só fica guardada no navegador com consentimento de
  // cookies; a rolagem é medida sempre, em memória.
  useEffect(() => {
    if (!enabled) return;
    startEngagementTracking();
    if (hasConsent()) initLeadTracking();
    const onConsent = (e: Event) => {
      if ((e as CustomEvent<Consent>).detail === "granted") initLeadTracking();
      else clearLeadTracking();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [enabled]);

  const open = useCallback((intent: LeadIntent, source: string) => {
    trackLeadFormOpen(source);
    setRequest({ intent, source });
  }, []);

  return (
    <LeadCtx.Provider value={{ enabled, open }}>
      {children}
      {enabled && (
        <>
          <LeadDialog
            request={request}
            onClose={() => setRequest(null)}
            locale={locale}
            currency={currency}
          />
          {!request && (
            <WhatsAppFloat
              label={isPortugal(locale, currency) ? "leadFormPT" : "leadForm"}
              onClick={() => open("whatsapp", "whatsapp_float")}
            />
          )}
        </>
      )}
    </LeadCtx.Provider>
  );
}

type FieldError = "name" | "email" | "phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form: FormData): FieldError[] {
  const errors: FieldError[] = [];
  if (String(form.get("name") ?? "").trim().length < 2) errors.push("name");
  if (!EMAIL_RE.test(String(form.get("email") ?? "").trim())) errors.push("email");
  const digits = String(form.get("phone") ?? "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) errors.push("phone");
  return errors;
}

function LeadDialog({
  request,
  onClose,
  locale,
  currency,
}: {
  request: { intent: LeadIntent; source: string } | null;
  onClose: () => void;
  locale: string;
  currency: string;
}) {
  const t = useTranslations(isPortugal(locale, currency) ? "leadFormPT" : "leadForm");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedAt = useRef(0);
  // Uma chave por abertura do formulário: clique duplo ou reenvio chegam ao
  // n8n com a mesma chave e ele reconhece o lead repetido.
  const idempotencyKey = useRef("");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [done, setDone] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (request && !dialog.open) {
      openedAt.current = Date.now();
      idempotencyKey.current =
        crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setErrors([]);
      setDone(null);
      dialog.showModal();
    } else if (!request && dialog.open) {
      dialog.close();
    }
  }, [request]);

  const intent = request?.intent ?? "demo";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) return;
    const form = new FormData(event.currentTarget);
    const found = validate(form);
    setErrors(found);
    if (found.length) {
      const first = event.currentTarget.querySelector<HTMLElement>(`[name="${found[0]}"]`);
      first?.focus();
      return;
    }

    const name = String(form.get("name")).trim();
    const body = {
      idempotencyKey: idempotencyKey.current,
      name,
      email: String(form.get("email")).trim(),
      phone: String(form.get("phone")).trim(),
      consent: true,
      consentText: t("consentPlain"),
      website: String(form.get("website") ?? ""),
      intent: request.intent,
      source: request.source,
      locale,
      currency,
      fillMs: Date.now() - openedAt.current,
      context: collectLeadContext(),
    };

    // keepalive: o envio termina mesmo que a pessoa já esteja no WhatsApp.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
    trackLeadSubmit(
      request.source,
      request.intent,
      hasConsent() ? { email: body.email, phone: normalizePhone(body.phone, locale, currency) } : undefined,
    );

    // Abre o WhatsApp ainda dentro do clique (senão o navegador bloqueia o
    // popup) e deixa na tela um botão pra quem teve o popup barrado.
    const url = whatsappUrl(t(`whatsappText.${request.intent}`, { name }), currency);
    window.open(url, "_blank", "noopener");
    setDone({ name, url });
  }

  const privacyHref = "/privacy";
  const hasError = (field: FieldError) => errors.includes(field);
  const inputClass = (field: FieldError) =>
    // 16px: abaixo disso o iPhone dá zoom na página ao tocar no campo (e não volta).
    `mt-1.5 block h-11 w-full rounded border bg-gray-950 px-3 text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-400 ${
      hasError(field) ? "border-red-400" : "border-white/15"
    }`;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="lead-title"
      // Com o teclado aberto no celular sobra pouca altura: o formulário
      // rola por dentro (sem arrastar a página de trás junto).
      className="lead-dialog max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-gray-900 p-0 text-gray-200 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="lead-title" className="text-xl font-semibold leading-snug text-white">
            {done ? t("successTitle", { name: done.name.split(" ")[0] }) : t(`title.${intent}`)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="-mr-2 -mt-1 rounded p-2 text-gray-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-400">{t("successBody")}</p>
            {/* Botão, não link wa.me: o widget do Sales Flow intercepta todo
                <a href="wa.me…"> e abriria um segundo formulário. */}
            <button
              type="button"
              onClick={() => window.open(done.url, "_blank", "noopener")}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded bg-brand-500 px-6 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("openWhatsapp")}
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-400">{t("subtitle")}</p>
            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor="lead-name" className="text-sm font-medium text-gray-300">
                  {t("nameLabel")}
                </label>
                <input
                  id="lead-name"
                  name="name"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  aria-invalid={hasError("name")}
                  className={inputClass("name")}
                />
                {hasError("name") && <p className="mt-1 text-xs text-red-400">{t("errors.name")}</p>}
              </div>
              <div>
                <label htmlFor="lead-email" className="text-sm font-medium text-gray-300">
                  {t("emailLabel")}
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={hasError("email")}
                  className={inputClass("email")}
                />
                {hasError("email") && <p className="mt-1 text-xs text-red-400">{t("errors.email")}</p>}
              </div>
              <div>
                <label htmlFor="lead-phone" className="text-sm font-medium text-gray-300">
                  {t("phoneLabel")}
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={t("phonePlaceholder")}
                  aria-invalid={hasError("phone")}
                  className={inputClass("phone")}
                />
                {hasError("phone") && <p className="mt-1 text-xs text-red-400">{t("errors.phone")}</p>}
              </div>

              {/* Campo-isca invisível contra robôs. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="lead-website">Website</label>
                <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded bg-brand-500 px-6 text-[15px] font-semibold text-gray-950 transition-[background-color,transform] duration-200 ease-out hover:bg-brand-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t("submit")}
              </button>

              {/* Aviso, sem caixa pra marcar: a base legal é o próprio pedido de
                  contato (medidas pré-contratuais), não o consentimento. */}
              <p className="text-center text-xs leading-relaxed text-gray-500">
                {t.rich("consent", {
                  link: (chunks) => (
                    <a
                      href={privacyHref}
                      target="_blank"
                      rel="noopener"
                      className="text-gray-300 underline underline-offset-2 hover:text-white"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

function WhatsAppFloat({
  label,
  onClick,
}: {
  label: "leadForm" | "leadFormPT";
  onClick: () => void;
}) {
  const t = useTranslations(label);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("floatLabel")}
      title={t("floatLabel")}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </button>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
