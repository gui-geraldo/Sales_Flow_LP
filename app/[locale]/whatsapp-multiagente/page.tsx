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
import { FeatureGrid } from "@/components/seo/FeatureGrid";
import { Showcase } from "@/components/seo/Showcase";
import { Bridge } from "@/components/seo/Bridge";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { TeamMockup } from "@/components/mockup/TeamMockup";
import { PermissionsMockup } from "@/components/mockup/PermissionsMockup";
import { getRequestCurrency } from "@/lib/request-currency";
import { PRODUCT } from "@/lib/site";

// Página de problema/solução "WhatsApp multiagente" (blueprint SEO da
// Espanha, 29/09): várias pessoas no mesmo número, sem caos. Aprofunda o
// multiagente e faz a ponte pro /crm-whatsapp. Não promete trava contra
// duas pessoas respondendo ao mesmo tempo (não existe): só responsável,
// filtro "Mías", notas internas, perfis e caixas por pessoa. Só em espanhol.
export const dynamic = "force-dynamic";

const PATH = "/whatsapp-multiagente";
const NS = "multiPage";

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

export default async function WhatsappMultiagentePage({ params }: { params: Promise<{ locale: string }> }) {
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
        <SeoHero namespace={`${NS}.hero`} source="multi" breadcrumb={t("breadcrumb")}>
          <TeamMockup />
        </SeoHero>
        <Definition namespace={`${NS}.definition`} />
        <ClinicAbout />
        <ClinicProblem namespace={`${NS}.problem`} />
        <CompareTable namespace={`${NS}.compare`} />
        <FeatureGrid namespace={`${NS}.features`} />
        <Showcase namespace={`${NS}.permissions`}>
          <PermissionsMockup />
        </Showcase>
        <Bridge namespace={`${NS}.toCrm`} to="crm" />
        <HowItWorks namespace={`${NS}.howItWorks`} />
        <Bridge namespace={`${NS}.clinics`} to="home" />
        <Security namespace="seoSecurity" />
        <Pricing />
        <Faq namespace={`${NS}.faq`} />
        <FinalCta namespace={`${NS}.finalCta`} source="multi_final_cta" />
        <Footer />
      </main>
    </LeadProvider>
  );
}
