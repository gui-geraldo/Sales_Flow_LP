import { getTranslations } from "next-intl/server";
import { COMPANY } from "@/lib/legal";
import { getCurrencyConfig, type Currency } from "@/lib/pricing";
import { ORGANIZATION, PRODUCT, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";

// Dados estruturados (schema.org em JSON-LD) da home. Talker Flow é a
// organização (#organization); Sales Flow é o software (#salesflow), ligado
// a ela por "provider". Só dados verificáveis e que já estão na página:
// sem avaliações, notas ou prêmios.

type FaqItem = { question: string; answer: string };

// "€ 149" / "R$ 497" / "US$ 149" → "149"
const numericPrice = (amount: string) => amount.replace(/[^\d.,]/g, "").replace(",", ".");

// Onde cada preço vale (regra de moeda por país do middleware). O USD vale
// pro resto do mundo, então vai sem região.
const REGIONS: Record<Currency, string[] | null> = { BRL: ["BR"], EUR: ["ES", "PT"], USD: null };

export async function StructuredData({ locale, canonical }: { locale: string; canonical: string }) {
  const meta = await getTranslations(locale === "pt" ? "meta" : "clinic.meta");
  const faq = await getTranslations("faq");
  const pricing = await getTranslations("pricing");
  const faqItems = faq.raw("items") as FaqItem[];
  const plans = pricing.raw("plans") as { name: string; highlighted: boolean }[];
  const planName = (plans.find((p) => p.highlighted) ?? plans[0]).name;
  const orgId = `${SITE_URL}/#organization`;
  const logo = `${SITE_URL}/logo-badge.png`;

  // Mesmas três ofertas em qualquer versão: o dado não muda com o país de
  // quem visita (os robôs visitam quase sempre dos EUA).
  const offers = (["BRL", "EUR", "USD"] as const).map((currency) => {
    const price = numericPrice(getCurrencyConfig(currency).amount);
    const regions = REGIONS[currency];
    return {
      "@type": "Offer",
      name: planName,
      price,
      priceCurrency: currency,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: currency,
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      ...(regions ? { eligibleRegion: regions.map((name) => ({ "@type": "Country", name })) } : {}),
      url: `${SITE_URL}/#precos`,
      seller: { "@id": orgId },
    };
  });

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: ORGANIZATION,
      legalName: COMPANY.name,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: logo, width: 168, height: 168 },
      email: COMPANY.email,
      taxID: COMPANY.cnpj,
      address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: PRODUCT,
      publisher: { "@id": orgId },
      inLanguage: ["pt", "es", "en"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#salesflow`,
      name: PRODUCT,
      description: meta("description"),
      url: `${SITE_URL}/`,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CRM",
      operatingSystem: "Web",
      inLanguage: locale,
      image: `${SITE_URL}/og.png`,
      provider: { "@id": orgId },
      offers,
    },
    {
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      url: canonical,
      inLanguage: locale,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON gerado no servidor a partir das próprias traduções; "<" escapado
      // pra não fechar a tag por engano.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
