import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { CtaLink } from "../CtaLink";
import { Reveal } from "../Reveal";
import { WordReveal } from "./WordReveal";
import { V1Phone } from "./V1Phone";

export function V1Hero() {
  const t = useTranslations("v1.hero");

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24">
      <div className="pointer-events-none absolute -top-40 right-[-8%] h-[460px] w-[460px] rounded-full bg-[rgba(22,163,74,0.16)] blur-[110px]" />
      <div className="pointer-events-none absolute top-32 left-[-10%] h-[380px] w-[380px] rounded-full bg-[rgba(13,148,136,0.14)] blur-[110px]" />
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_10%,transparent_75%)]" />

      <Container className="relative grid items-center gap-16 pb-24 md:grid-cols-[1.1fr_0.9fr] md:pb-32">
        <div>
          <Reveal>
            <span className="v1-mono inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wide shadow-[0_0_0_1px_var(--v1-line),0_2px_5px_rgba(16,18,32,0.06)]">
              <span className="v1-pulse h-1.5 w-1.5 rounded-full bg-[var(--v1-accent)]" />
              {t("eyebrow")}
            </span>
          </Reveal>

          <WordReveal
            text={t("title")}
            className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-tight md:text-[3.75rem]"
          />

          <Reveal delay={0.9}>
            <p className="v1-ink-soft mt-6 max-w-xl text-lg leading-relaxed">{t("subtitle")}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="#cta" source="v1_hero" className="v1-btn v1-btn-accent">
                {t("ctaPrimary")}
              </CtaLink>
              <a href="#features" className="v1-btn v1-btn-ghost">
                {t("ctaSecondary")}
              </a>
            </div>

            <p className="v1-mono v1-ink-soft mt-4 text-xs">{t("note")}</p>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-[rgba(22,163,74,0.18)] via-[rgba(13,148,136,0.08)] to-transparent blur-3xl" />
            <V1Phone />

            <div className="v1-orb-float v1-card absolute -left-20 bottom-28 hidden items-center gap-3 px-4 py-3 lg:flex">
              <span className="relative flex h-3 w-3">
                <span className="v1-orb-ring" />
                <span className="relative h-3 w-3 rounded-full bg-[var(--v1-accent)]" />
              </span>
              <div>
                <p className="text-xs font-semibold">{t("live.title")}</p>
                <p className="v1-mono v1-ink-soft text-[10px]">{t("live.description")}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
