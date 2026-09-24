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
import { Trust } from "@/components/Trust";
import { ClinicHero } from "@/components/clinic/ClinicHero";
import { ClinicAbout } from "@/components/clinic/ClinicAbout";
import { ClinicResults } from "@/components/clinic/ClinicResults";
import { ClinicProblem } from "@/components/clinic/ClinicProblem";
import { ClinicDifferentiators } from "@/components/clinic/ClinicDifferentiators";

// A seção de preços lê o cookie de moeda por requisição (geolocalização),
// então a página não pode ser pré-renderizada estaticamente no build.
export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Variante de clínica (espanhol e inglês): hero/problema/diferenciais
  // falam de clínica, com "Quiénes somos" + carrossel e a tela de
  // Resultados. Controlada só pelo locale, sem rota própria.
  if (locale === "es" || locale === "en") {
    return (
      <main>
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
    );
  }

  // Português: página genérica de sempre, só com os dois mockups da
  // plataforma (conversa no Hero, Resultados logo abaixo da prova social).
  // Sem "Quiénes somos"/carrossel.
  return (
    <main>
      <Header />
      <Hero />
      <Trust />
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
  );
}
