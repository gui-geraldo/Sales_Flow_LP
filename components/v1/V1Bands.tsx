import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { CtaLink } from "../CtaLink";
import { Emph } from "./Emph";

export function V1Objection() {
  const t = useTranslations("v1.objection");
  const items = t.raw("items") as string[];

  return (
    <section className="py-20">
      <Container className="text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            <Emph text={t("title")} className="v1-serif v1-gradient-text" />
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {items.map((item) => (
              <span key={item} className="v1-card inline-flex items-center gap-2 !rounded-full px-5 py-2.5 text-sm font-medium">
                <Check size={16} className="text-[var(--v1-accent)]" strokeWidth={2.5} />
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

type SecurityItem = { tag: string; title: string; description: string };

export function V1Security() {
  const t = useTranslations("v1.security");
  const items = t.raw("items") as SecurityItem[];

  return (
    <section className="v1-bg-dark v1-dark-grid relative overflow-hidden py-24">
      <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[rgba(13,148,136,0.2)] blur-[120px]" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="v1-mono text-xs uppercase tracking-widest text-[#4ade80]">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{t("title")}</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.1}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-[rgba(74,222,128,0.4)]"
            >
              <span className="v1-mono inline-block rounded-md bg-[rgba(74,222,128,0.12)] px-2.5 py-1 text-[11px] font-medium tracking-widest text-[#4ade80]">
                {item.tag}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-white/60">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function V1Risk() {
  const t = useTranslations("v1.risk");

  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        <Reveal className="v1-card relative overflow-hidden !rounded-[32px] p-10 text-center md:p-14">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-[rgba(22,163,74,0.15)] blur-[80px]" />
          <div className="relative">
            <h2 className="v1-serif text-4xl md:text-5xl">{t("title")}</h2>
            <p className="v1-ink-soft mx-auto mt-5 max-w-xl text-lg leading-relaxed">{t("text")}</p>
            <CtaLink href="#cta" source="v1_risk" className="v1-btn v1-btn-accent mt-8">
              {t("cta")}
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
