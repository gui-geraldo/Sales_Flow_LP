import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Logo } from "../Logo";
import { Reveal } from "../Reveal";
import { CtaLink } from "../CtaLink";
import { Emph } from "./Emph";

export function V1FinalCta() {
  const t = useTranslations("v1.finalCta");
  const footer = useTranslations("footer");

  return (
    <>
      <section id="cta" className="v1-bg-dark v1-dark-grid relative overflow-hidden py-28">
        <div className="pointer-events-none absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-[rgba(22,163,74,0.3)] blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-24 right-[10%] h-80 w-80 rounded-full bg-[rgba(13,148,136,0.3)] blur-[110px]" />

        <Container className="relative max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              <Emph text={t("title")} className="v1-serif v1-gradient-text" />
            </h2>
            <p className="mt-5 text-lg text-white/60">{t("subtitle")}</p>
            <CtaLink href="#" source="v1_final_cta" className="v1-btn v1-btn-light mt-9">
              {t("cta")}
            </CtaLink>
          </Reveal>
        </Container>
      </section>

      <footer className="v1-bg-dark-2 border-t border-white/10 py-8 text-white/50">
        <Container className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex items-center gap-2.5 text-white">
            <Logo size={24} />
            <span className="text-sm font-semibold">Sales Flow</span>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Sales Flow. {footer("rights")}
          </p>
          <p className="v1-mono text-xs">{footer("madeIn")}</p>
        </Container>
      </footer>
    </>
  );
}
