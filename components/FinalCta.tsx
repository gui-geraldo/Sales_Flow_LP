import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section id="cta" className="border-t border-white/10 bg-gray-950 py-10 md:py-12">
      <Container className="max-w-xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white">{t("title")}</h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
          <CtaLink
            href="#"
            source="final_cta"
            className="mt-8 inline-flex h-12 items-center justify-center rounded bg-brand-500 px-8 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-brand-400"
          >
            {t("cta")}
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  );
}
