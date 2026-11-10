// NÚMEROS DE WHATSAPP COMERCIAL: fonte única para a LP, o formulário e as
// apresentações. Nenhum outro arquivo escreve número à mão; todos importam
// daqui. Não vem de variável de ambiente (é público e igual em todo ambiente).
// Trocou um número? Mude as duas linhas dele (dígitos + como aparece escrito)
// e, se for o BRL, gere de novo o QR das apresentações
// (python -I .claude/tmp/qr.py .claude/tmp/pylib, que lê o número daqui).

// BRL: Brasil (pt + R$)
export const WHATSAPP_NUMBER_BRL = "551152280448"; // desde 10/11/2026; antes 5511985223431
export const WHATSAPP_DISPLAY_BRL = "(11) 5228-0448";

// ES: Espanha e todo o resto fora do Brasil (es/en, € e US$)
export const WHATSAPP_NUMBER_ES = "34641337143";
export const WHATSAPP_DISPLAY_ES = "+34 641 33 71 43";

const waLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const whatsappLinkBrl = (text?: string) => waLink(WHATSAPP_NUMBER_BRL, text);
export const whatsappLinkEs = (text?: string) => waLink(WHATSAPP_NUMBER_ES, text);

// Escolhe o número pela moeda da visita: R$ = Brasil, qualquer outra = ES.
export function whatsappUrl(text: string, currency: string) {
  return currency === "BRL" ? whatsappLinkBrl(text) : whatsappLinkEs(text);
}

// Português de Portugal (pt com EUR) tem textos próprios no formulário, no
// aviso de cookies e na política de privacidade; o pt do Brasil usa os de sempre.
export function isPortugal(locale: string, currency: string) {
  return locale === "pt" && currency === "EUR";
}
