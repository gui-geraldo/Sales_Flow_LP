// Telefone digitado sem código do país: completa pelo idioma/moeda da página
// (9 dígitos na Espanha e em Portugal, 10 ou 11 no Brasil com DDD).
// Com "+" ou "00", mantém o que veio. Devolve E.164 ("+34600000000") ou null.
export function normalizePhone(raw: string, locale: string, currency: string): string | null {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) digits = digits.slice(2);
  const hasCountryCode = trimmed.startsWith("+") || trimmed.startsWith("00");

  if (!hasCountryCode) {
    if (currency === "BRL" && locale === "pt") {
      digits = digits.replace(/^0+/, "");
      if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
    } else if (digits.length === 9) {
      if (locale === "es" && currency === "EUR") digits = "34" + digits;
      else if (locale === "pt" && currency === "EUR") digits = "351" + digits;
    }
  }
  if (digits.length < 8 || digits.length > 15) return null;
  return "+" + digits;
}
