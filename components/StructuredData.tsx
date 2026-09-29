import { getTranslations } from "next-intl/server";
import { COMPANY } from "@/lib/legal";
import { getCurrencyConfig, type Currency } from "@/lib/pricing";
import { BRAND, SITE_URL, SOCIAL_PROFILES, variantPath } from "@/lib/site";

// Dados estruturados (schema.org em JSON-LD) da home: quem é a empresa, o
// que é o produto, quanto custa e as perguntas frequentes. Ajudam buscadores
// e IAs a separar o "Sales Flow by Talker Flow" de outros produtos com nome
// parecido. Tudo aqui repete o que já está visível na página.

type FaqItem = { question: string; answer: string };

// "€ 149" / "R$ 497" / "US$ 149" → "149"
const numericPrice = (amount: string) => amount.replace(/[^\d.,]/g, "").replace(",", ".");

export async function StructuredData({ locale, currency }: { locale: string; currency: Currency }) {
  const meta = await getTranslations(locale === "pt" ? "meta" : "clinic.meta");
  const faq = await getTranslations("faq");
  const pricing = await getTranslations("pricing");
  const faqItems = faq.raw("items") as FaqItem[];
  const plans = pricing.raw("plans") as { name: string; description: string; highlighted: boolean }[];
  const plan = plans.find((p) => p.highlighted) ?? plans[0];
  const { amount } = getCurrencyConfig(currency);
  const pageUrl = `${SITE_URL}${variantPath(locale, currency.toLowerCase())}`;
  const orgId = `${SITE_URL}/#organization`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: COMPANY.name,
      alternateName: ["Talker Flow", BRAND],
      url: SITE_URL,
      logo: `${SITE_URL}/logo-badge.png`,
      email: COMPANY.email,
      taxID: COMPANY.cnpj,
      sameAs: SOCIAL_PROFILES,
      address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
      brand: { "@type": "Brand", name: BRAND, logo: `${SITE_URL}/logo-badge.png` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      publisher: { "@id": orgId },
      inLanguage: ["pt-BR", "pt-PT", "es", "en"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: BRAND,
      alternateName: "Sales Flow",
      description: meta("description"),
      url: pageUrl,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CRM",
      operatingSystem: "Web",
      inLanguage: locale,
      image: `${SITE_URL}/og.png`,
      publisher: { "@id": orgId },
      offers: {
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
        price: numericPrice(amount),
        priceCurrency: currency,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: numericPrice(amount),
          priceCurrency: currency,
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
        url: `${pageUrl}#precos`,
        seller: { "@id": orgId },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
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
