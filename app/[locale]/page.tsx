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

  // Variante independente para o público de língua espanhola: mesma
  // estrutura de página, mas hero/problema/diferenciais falam de clínica
  // (dor real desse segmento), com prova social dos clientes de clínica
  // que já usam o produto. Controlada só pelo locale "es", sem rota própria.
  if (locale === "es") {
    return (
      <main>
        <Header />
        <ClinicHero />
        <ClinicAbout />
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

  return (
    <main>
      <Header />
      <Hero />
      <Trust />
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
