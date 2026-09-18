import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Problem } from "@/components/Problem";
import { Differentiators } from "@/components/Differentiators";
import { HowItWorks } from "@/components/HowItWorks";
import { Security } from "@/components/Security";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

// A seção de preços lê o cookie de moeda por requisição (geolocalização),
// então a página não pode ser pré-renderizada estaticamente no build.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
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
