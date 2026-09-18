export type Currency = "BRL" | "EUR" | "USD";

type CurrencyConfig = {
  amount: string;
  checkoutUrl: string | null;
  isPlaceholder: boolean;
  automationFee: string;
};

const DEFAULTS: Record<Currency, string> = {
  BRL: "R$ 497",
  EUR: "€ ---",
  USD: "US$ ---",
};

const AUTOMATION_FEE: Record<Currency, string> = {
  BRL: "R$ 0,02",
  EUR: "€ 0,02",
  USD: "US$ 0.01",
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

export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  const amount = ENV_PRICE[currency] || DEFAULTS[currency];

  return {
    amount,
    checkoutUrl: ENV_CHECKOUT_URL[currency] || null,
    isPlaceholder: amount.includes("---"),
    automationFee: AUTOMATION_FEE[currency],
  };
}
