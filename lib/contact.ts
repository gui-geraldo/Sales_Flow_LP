// Número de WhatsApp comercial das saídas de contato. Configurável na
// Vercel; o Brasil pode ter um número próprio (NEXT_PUBLIC_WHATSAPP_NUMBER_BRL)
// e, sem ele, usa o mesmo das outras moedas.
const digits = (value: string) => value.replace(/\D/g, "");

const WHATSAPP_NUMBER = digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34624387902");
const WHATSAPP_NUMBER_BRL = digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_BRL || "") || WHATSAPP_NUMBER;

export function whatsappUrl(text: string, currency: string) {
  const number = currency === "BRL" ? WHATSAPP_NUMBER_BRL : WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Português de Portugal (pt com EUR) tem textos próprios no formulário, no
// aviso de cookies e na política de privacidade; o pt do Brasil usa os de sempre.
export function isPortugal(locale: string, currency: string) {
  return locale === "pt" && currency === "EUR";
}
