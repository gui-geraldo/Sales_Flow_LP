import { V1Header } from "@/components/v1/V1Header";
import { V1Hero } from "@/components/v1/V1Hero";
import { V1Contrast } from "@/components/v1/V1Contrast";
import { V1Features } from "@/components/v1/V1Features";
import { V1Steps } from "@/components/v1/V1Steps";
import { V1Objection, V1Security, V1Risk } from "@/components/v1/V1Bands";
import { V1Pricing } from "@/components/v1/V1Pricing";
import { V1Faq } from "@/components/v1/V1Faq";
import { V1FinalCta } from "@/components/v1/V1FinalCta";

// A seção de preços lê o cookie de moeda por requisição (geolocalização).
export const dynamic = "force-dynamic";

export default function V1Page() {
  return (
    <main>
      <V1Header />
      <V1Hero />
      <V1Contrast />
      <V1Features />
      <V1Steps />
      <V1Objection />
      <V1Security />
      <V1Risk />
      <V1Pricing />
      <V1Faq />
      <V1FinalCta />
    </main>
  );
}
