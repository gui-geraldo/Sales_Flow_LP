import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Differentiators } from "@/components/Differentiators";
import { HowItWorks } from "@/components/HowItWorks";
import { Security } from "@/components/Security";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ClinicHero } from "@/components/clinic/ClinicHero";
import { ClinicAbout } from "@/components/clinic/ClinicAbout";
import { ClinicResults } from "@/components/clinic/ClinicResults";
import { ClinicProblem } from "@/components/clinic/ClinicProblem";
import { ClinicDifferentiators } from "@/components/clinic/ClinicDifferentiators";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { StructuredData } from "@/components/StructuredData";
import { getRequestCurrency } from "@/lib/request-currency";
import { SITE_URL, VARIANTS, homeAlternates, variantPath } from "@/lib/site";

// Idioma e moeda saem do país da visita a cada requisição (middleware),
// então a página não pode ser pré-renderizada estaticamente no build.
export const dynamic = "force-dynamic";

// A raiz (que escolhe idioma e moeda pelo país) é o x-default e aponta pra si
// mesma; cada variante com ?lang=&currency= é canônica de si mesma. Assim os
// buscadores indexam as cinco versões, e não só a que o país deles recebe.
// Vai como <link> na página (o React 19 leva pro <head>) e não pelo
// `alternates` do metadata: o Next descarta a query string de URLs com
// caminho "/" (resolveAbsoluteUrlWithPathname devolve só a origem).
function SeoLinks({ query }: { query: Record<string, string | string[] | undefined> }) {
  const lang = typeof query.lang === "string" ? query.lang.toLowerCase() : null;
  const currency = typeof query.currency === "string" ? query.currency.toLowerCase() : null;
  const variant = VARIANTS.find((v) => v.lang === lang && v.currency === currency);
  const canonical = `${SITE_URL}${variant ? variantPath(variant.lang, variant.currency) : "/"}`;

  return (
    <>
      <link rel="canonical" href={canonical} />
      {Object.entries(homeAlternates()).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  );
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  // Em todas as moedas os botões de contato abrem o formulário curto antes do
  // WhatsApp; a moeda só decide número, textos de Portugal e prefixo do telefone.
  const currency = await getRequestCurrency();

  // Variante de clínica (espanhol e inglês): hero/problema/diferenciais
  // falam de clínica, com "Quiénes somos" + carrossel e a tela de
  // Resultados. Controlada só pelo locale, sem rota própria.
  if (locale === "es" || locale === "en") {
    return (
      <LeadProvider enabled locale={locale} currency={currency}>
        <main>
          <SeoLinks query={query} />
          <StructuredData locale={locale} currency={currency} />
          <Header />
          <ClinicHero />
          <ClinicAbout />
          <ClinicResults />
          <ClinicProblem />
          <ClinicDifferentiators />
          <HowItWorks />
          <Security />
          <Pricing />
          <Faq />
          <FinalCta />
          <Footer />
        </main>
      </LeadProvider>
    );
  }

  // Português: página genérica de sempre, só com os dois mockups da
  // plataforma (conversa no Hero, Resultados logo abaixo). Sem "Quiénes
  // somos"/carrossel e sem a faixa de prova social (removida a pedido).
  return (
    <LeadProvider enabled locale={locale} currency={currency}>
      <main>
        <SeoLinks query={query} />
        <StructuredData locale={locale} currency={currency} />
        <Header />
        <Hero />
        <ClinicResults namespace="results" />
        <Problem />
        <Differentiators />
        <HowItWorks />
        <Security />
        <Pricing />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    </LeadProvider>
  );
}
