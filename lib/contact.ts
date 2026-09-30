// Número de WhatsApp comercial das saídas de contato (só dígitos, com código
// do país). Fonte única: mudou o número, muda aqui e faz commit. Não vem de
// variável de ambiente (é público e igual em todo ambiente).
const WHATSAPP_NUMBER = "34641337143"; // Espanha e todo o resto (fora do Brasil)
const WHATSAPP_NUMBER_BRL = "5511985223431"; // Brasil

export function whatsappUrl(text: string, currency: string) {
  const number = currency === "BRL" ? WHATSAPP_NUMBER_BRL : WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Português de Portugal (pt com EUR) tem textos próprios no formulário, no
// aviso de cookies e na política de privacidade; o pt do Brasil usa os de sempre.
export function isPortugal(locale: string, currency: string) {
  return locale === "pt" && currency === "EUR";
}
