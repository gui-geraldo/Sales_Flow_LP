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

// Versão pt-BR da /crm-whatsapp (grupo "CRM WhatsApp" do Google Ads Brasil,
// 14/11/2026). Mesma estrutura da espanhola, linguagem geral (sem foco em
// clínica). Só em português; a espanhola não muda.
export const dynamic = "force-dynamic";

const PATH = "/crm-para-whatsapp";
const NS = "crmPageBr";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "pt", namespace: `${NS}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: PRODUCT,
      title: t("title"),
      description: t("description"),
      locale: "pt_BR",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: PRODUCT }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: ["/og.png"] },
  };
}

export default async function CrmParaWhatsappPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "pt") notFound();
  setRequestLocale(locale);
  const currency = await getRequestCurrency();
  const t = await getTranslations(NS);

  return (
    <LeadProvider enabled locale={locale} currency={currency}>
      <main>
        <SeoLinks path={PATH} onlyLang="pt" />
        <PageStructuredData path={PATH} namespace={NS} inLanguage="pt-BR" />
        <Header />
        <SeoHero namespace={`${NS}.hero`} source="crmbr" breadcrumb={t("breadcrumb")}>
          <FunnelMockup />
        </SeoHero>
        <Definition namespace={`${NS}.definition`} />
        <ClinicAbout namespace="about" excludeMedia={["/team/Video_2.mp4"]} />
        <ClinicProblem namespace={`${NS}.problem`} />
        <FlowChain namespace={`${NS}.flow`} />
        <FeatureGrid namespace={`${NS}.features`} />
        <Bridge namespace={`${NS}.toApi`} to="api" />
        <HowItWorks namespace={`${NS}.howItWorks`} />
        <Security />
        <Pricing />
        <Faq namespace={`${NS}.faq`} />
        <FinalCta namespace={`${NS}.finalCta`} source="crmbr_final_cta" />
        <Footer />
      </main>
    </LeadProvider>
  );
}
