import { COMPANY } from "@/lib/legal";
import { getCurrencyConfig } from "@/lib/pricing";
import { LANGS, ORGANIZATION, PRODUCT, SITE_URL, SOCIAL_PROFILES, langPath } from "@/lib/site";

// Resumo em texto puro pra agentes de IA (proposta llms.txt). Efeito pequeno
// nos buscadores, mas custa nada e ajuda agentes que leem o arquivo a
// entender o produto e separá-lo do salesflow.io (automação de LinkedIn).

const LANGUAGE_NAMES: Record<string, string> = {
  pt: "Portuguese",
  es: "Spanish (focused on clinics)",
  en: "English (focused on clinics)",
};

export function GET() {
  const brl = getCurrencyConfig("BRL");
  const eur = getCurrencyConfig("EUR");
  const usd = getCurrencyConfig("USD");

  const body = `# ${PRODUCT} (by ${ORGANIZATION})

> ${PRODUCT} is a WhatsApp customer service, CRM and AI platform made by ${ORGANIZATION} (legal name ${COMPANY.name}, Brazil, CNPJ ${COMPANY.cnpj}). Every conversation that arrives on WhatsApp keeps the ad it came from, so the business knows which campaigns bring customers, and the whole team shares one inbox with the full history. In Spain and other markets it is focused on clinics (for example dental and veterinary).

It is not related to salesflow.io (a LinkedIn outreach tool with a similar name).

## What it does

- Shared WhatsApp inbox for the whole team, with contact history (official WhatsApp Business API and non-official connection).
- Ad attribution: conversations from Meta click-to-WhatsApp ads arrive tagged with the ad; a results dashboard shows ad spend, sales and return per campaign.
- AI per inbox: replies, classifies lead temperature (cold, warm, hot) and helps the team focus on who is ready to buy or book.
- Automations and follow-ups, scheduled messages and broadcasts.
- Data encrypted and isolated per customer account.

## Pricing

- Professional: ${brl.amount}/month (Brazil), ${eur.amount}/month (Spain and Portugal), ${usd.amount}/month (other countries). Plus a per-use fee for each automation run: ${brl.automationFee}, ${eur.automationFee} or ${usd.automationFee}.
- Scale: custom pricing for larger operations and clinic groups.
- Official WhatsApp template messages are billed by Meta directly to the customer; no commission is added. No minimum term.

## Pages

${LANGS.map((lang) => `- [${LANGUAGE_NAMES[lang]}](${SITE_URL}${langPath("/", lang)})`).join("\n")}
- Prices are shown in the visitor's currency (BRL in Brazil, EUR in Spain and Portugal, USD elsewhere).
- [Privacy policy](${SITE_URL}/privacy)
- [Terms of use](${SITE_URL}/terms)

## Contact

- Email: ${COMPANY.email}
- Instagram: ${SOCIAL_PROFILES[0]}
- Demos and sales happen on WhatsApp after a short form on the website.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
