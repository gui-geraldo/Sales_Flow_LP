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
import { CompareTable } from "@/components/seo/CompareTable";
import { CostList } from "@/components/seo/CostList";
import { FeatureGrid } from "@/components/seo/FeatureGrid";
import { Bridge } from "@/components/seo/Bridge";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { PlatformMockup } from "@/components/mockup/PlatformMockup";
import { getRequestCurrency } from "@/lib/request-currency";
import { PRODUCT } from "@/lib/site";

// Página do grupo "API oficial" do Google Ads Brasil (14/11/2026), que leva
// a maior parte dos cliques. Responde o que a busca pergunta: o que é a API
// oficial, quem ativa e quanto custa (plano nosso + Meta direto no cartão,
// regras de cobrança conferidas na tabela oficial da Meta em 14/11/2026).
// Não promete coexistência (app + API no mesmo número). Só em pt-BR.
export const dynamic = "force-dynamic";

const PATH = "/api-oficial-whatsapp";
const NS = "apiPage";

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

export default async function ApiOficialWhatsappPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <SeoHero namespace={`${NS}.hero`} source="api" breadcrumb={t("breadcrumb")}>
          <PlatformMockup />
        </SeoHero>
        <Definition namespace={`${NS}.definition`} />
        <CostList namespace={`${NS}.costs`} />
        <ClinicAbout namespace="about" excludeMedia={["/team/Video_2.mp4"]} />
        <ClinicProblem namespace={`${NS}.problem`} />
        <CompareTable namespace={`${NS}.compare`} />
        <FeatureGrid namespace={`${NS}.features`} />
        <HowItWorks namespace={`${NS}.howItWorks`} />
        <Bridge namespace={`${NS}.toCrm`} to="crmbr" />
        <Security />
        <Pricing />
        <Faq namespace={`${NS}.faq`} />
        <FinalCta namespace={`${NS}.finalCta`} source="api_final_cta" />
        <Footer />
      </main>
    </LeadProvider>
  );
}
