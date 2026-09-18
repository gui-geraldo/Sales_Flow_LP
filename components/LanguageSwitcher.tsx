"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");

  return (
    <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5 text-xs font-semibold text-gray-500">
      <span className="sr-only">{t("label")}</span>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded px-2 py-1 transition-colors ${
            locale === loc
              ? "bg-brand-600 text-white"
              : "hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
