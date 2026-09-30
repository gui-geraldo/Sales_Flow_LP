export type Currency = "BRL" | "EUR" | "USD";

// Header com a moeda da visita, definido só pelo middleware (lib/request-currency.ts).
export const CURRENCY_HEADER = "x-sf-currency";

type CurrencyConfig = {
  amount: string;
  checkoutUrl: string | null;
  isPlaceholder: boolean;
  automationFee: string;
};

// Preço do plano Profissional por moeda. Fonte única: mudou o preço, muda
// aqui e faz commit. Não vem de variável de ambiente (é público e igual em
// todo ambiente; ter o valor em dois lugares já fez a Vercel manter o antigo).
// BRL: Brasil · EUR: Espanha e Portugal · USD: resto do mundo (incl. América Latina hispânica)
const PRICE: Record<Currency, string> = {
  BRL: "R$ 599",
  EUR: "€ 149",
  USD: "US$ 149",
};

const AUTOMATION_FEE: Record<Currency, string> = {
  BRL: "R$ 0,05",
  EUR: "€ 0,02",
  USD: "US$ 0.02",
};

export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  return {
    amount: PRICE[currency],
    // Sem checkout na LP: todos os botões abrem o formulário antes do WhatsApp.
    checkoutUrl: null,
    isPlaceholder: false,
    automationFee: AUTOMATION_FEE[currency],
  };
}
