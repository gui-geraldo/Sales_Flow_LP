export type Currency = "BRL" | "EUR" | "USD";

// Header com a moeda da visita, definido só pelo middleware (lib/request-currency.ts).
export const CURRENCY_HEADER = "x-sf-currency";

type CurrencyConfig = {
  amount: string;
  checkoutUrl: string | null;
  isPlaceholder: boolean;
  automationFee: string;
};

const SYMBOL: Record<Currency, string> = {
  BRL: "R$",
  EUR: "€",
  USD: "US$",
};

const DEFAULTS: Record<Currency, string> = {
  BRL: "R$ 497",
  EUR: "€ 149",
  USD: "US$ 149",
};

const AUTOMATION_FEE: Record<Currency, string> = {
  BRL: "R$ 0,05",
  EUR: "€ 0,02",
  USD: "US$ 0.02",
};

const ENV_PRICE: Record<Currency, string | undefined> = {
  BRL: process.env.NEXT_PUBLIC_PRICE_BRL,
  EUR: process.env.NEXT_PUBLIC_PRICE_EUR,
  USD: process.env.NEXT_PUBLIC_PRICE_USD,
};

const ENV_CHECKOUT_URL: Record<Currency, string | undefined> = {
  BRL: process.env.NEXT_PUBLIC_CHECKOUT_URL_BRL,
  EUR: process.env.NEXT_PUBLIC_CHECKOUT_URL_EUR,
  USD: process.env.NEXT_PUBLIC_CHECKOUT_URL_USD,
};

// Na Vercel o preço pode vir só como número ("149"); aí o símbolo entra aqui.
function formatPrice(currency: Currency, raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  return /^\d+([.,]\d+)?$/.test(value) ? `${SYMBOL[currency]} ${value}` : value;
}

export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  const amount = formatPrice(currency, ENV_PRICE[currency]) ?? DEFAULTS[currency];

  return {
    amount,
    checkoutUrl: ENV_CHECKOUT_URL[currency] || null,
    isPlaceholder: amount.includes("---"),
    automationFee: AUTOMATION_FEE[currency],
  };
}
