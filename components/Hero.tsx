import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";
import { PlatformMockup } from "./mockup/PlatformMockup";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="border-b border-white/10 bg-gray-950 pt-8 md:pt-10">
      <Container className="grid items-start gap-14 pb-10 md:grid-cols-2 md:pb-12">
        <Reveal className="flex flex-col md:min-h-[480px] md:justify-between">
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            <span className="h-px w-7 bg-brand-500" aria-hidden="true" />
            {t("badge")}
          </p>

          <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-white md:mt-0 md:text-6xl">
            {t("titleStart")}{" "}
            <span className="text-brand-400">{t("titleEmphasis")}</span>{" "}
            {t("titleEnd")}
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-400 md:mt-0">
            {t("subtitle")}
          </p>

          <div className="mt-8 md:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink
                href="#cta"
                source="hero"
                className="inline-flex h-12 items-center justify-center rounded bg-brand-500 px-6 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-brand-400"
              >
                {t("ctaPrimary")}
              </CtaLink>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center justify-center rounded border border-white/15 px-6 text-[15px] font-semibold text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5"
              >
                {t("ctaSecondary")}
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">{t("noCreditCard")}</p>
          </div>
        </Reveal>

        {/* Mockup animado da bandeja real da plataforma (components/mockup),
            avançando pela margem direita no desktop como no Hero de clínica. */}
        <Reveal delay={0.15} className="hero-bleed-right">
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-lg">
            <PlatformMockup />
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
