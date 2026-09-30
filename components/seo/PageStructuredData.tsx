import { getTranslations } from "next-intl/server";
import { PRODUCT, SITE_URL } from "@/lib/site";
import { plainText } from "./links";

type FaqItem = { question: string; answer: string };

// JSON-LD das páginas de busca: WebPage (sobre o Sales Flow, o mesmo
// #salesflow da home), BreadcrumbList (Inicio › página) e o FAQPage com as
// perguntas que aparecem na própria página. Só o que está visível nela.
export async function PageStructuredData({ path, namespace }: { path: string; namespace: string }) {
  const t = await getTranslations(namespace);
  const url = `${SITE_URL}${path}`;
  const faq = t.raw("faq.items") as FaqItem[];

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: t("meta.title"),
      description: t("meta.description"),
      inLanguage: "es",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#salesflow` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: PRODUCT, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: t("breadcrumb"), item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      inLanguage: "es",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
