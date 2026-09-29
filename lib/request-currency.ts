import { headers } from "next/headers";
import { CURRENCY_HEADER, type Currency } from "./pricing";

// A moeda vem de um header que só o middleware define (a partir do país da
// visita). Não se lê do cookie NEXT_CURRENCY: o visitante poderia editá-lo.
export async function getRequestCurrency(): Promise<Currency> {
  const value = (await headers()).get(CURRENCY_HEADER);
  return value === "EUR" || value === "USD" ? value : "BRL";
}
