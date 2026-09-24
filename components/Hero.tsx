import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="border-b border-white/10 bg-gray-950 pt-16 md:pt-20">
      <Container className="grid items-start gap-14 pb-16 md:grid-cols-2 md:pb-20">
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

        <Reveal delay={0.15}>
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Print do produto — placeholder
              </span>
              <p className="max-w-xs text-base leading-snug text-gray-400">
                {t("screenshotBrief")}
              </p>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
