import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { Security } from "@/components/Security";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ClinicProblem } from "@/components/clinic/ClinicProblem";
import { ClinicAbout } from "@/components/clinic/ClinicAbout";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { SeoLinks } from "@/components/SeoLinks";
import { SeoHero } from "@/components/seo/SeoHero";
import { Definition } from "@/components/seo/Definition";
import { FlowChain } from "@/components/seo/FlowChain";
import { FeatureGrid } from "@/components/seo/FeatureGrid";
import { Bridge } from "@/components/seo/Bridge";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { FunnelMockup } from "@/components/mockup/FunnelMockup";
import { getRequestCurrency } from "@/lib/request-currency";
import { PRODUCT } from "@/lib/site";

// Página de categoria "CRM para WhatsApp" (blueprint SEO da Espanha, 29/09):
// horizontal (leads, vendas, equipe), não repete o hero nem o FAQ da home,
// que é a vertical de clínicas. Só em espanhol, pra qualquer país
// (middleware). Idioma e moeda saem da requisição, então não é estática.
export const dynamic = "force-dynamic";

const PATH = "/crm-whatsapp";
const NS = "crmPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "es", namespace: `${NS}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: PRODUCT,
      title: t("title"),
      description: t("description"),
      locale: "es_ES",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: PRODUCT }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: ["/og.png"] },
  };
}

export default async function CrmWhatsappPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  setRequestLocale(locale);
  const currency = await getRequestCurrency();
  const t = await getTranslations(NS);

  return (
    <LeadProvider enabled locale={locale} currency={currency}>
      <main>
        <SeoLinks path={PATH} onlyLang="es" />
        <PageStructuredData path={PATH} namespace={NS} />
        <Header />
        <SeoHero namespace={`${NS}.hero`} source="crm" breadcrumb={t("breadcrumb")}>
          <FunnelMockup />
        </SeoHero>
        <Definition namespace={`${NS}.definition`} />
        <ClinicAbout />
        <ClinicProblem namespace={`${NS}.problem`} />
        <FlowChain namespace={`${NS}.flow`} />
        <FeatureGrid namespace={`${NS}.features`} />
        <Bridge namespace={`${NS}.clinics`} to="home" />
        <HowItWorks namespace={`${NS}.howItWorks`} />
        <Security namespace="seoSecurity" />
        <Pricing />
        <Faq namespace={`${NS}.faq`} />
        <FinalCta namespace={`${NS}.finalCta`} source="crm_final_cta" />
        <Footer />
      </main>
    </LeadProvider>
  );
}
