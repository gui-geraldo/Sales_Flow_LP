import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
  // Nunca mostra o idioma na URL (talkerflow.me, não talkerflow.me/es):
  // o idioma sai do país da visita, no middleware. /es e /en antigos
  // redirecionam pra raiz.
  localePrefix: "never",
});
