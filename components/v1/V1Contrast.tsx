import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { Emph } from "./Emph";

export function V1Contrast() {
  const t = useTranslations("v1.contrast");
  const leftItems = t.raw("leftItems") as string[];
  const rightItems = t.raw("rightItems") as string[];

  return (
    <section className="v1-bg-dark v1-dark-grid relative overflow-hidden py-24">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[rgba(22,163,74,0.22)] blur-[120px]" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="v1-mono text-xs uppercase tracking-widest text-[#4ade80]">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            <Emph text={t("title")} className="v1-serif v1-gradient-text" />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60">{t("subtitle")}</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal className="rounded-[20px] border border-white/10 bg-white/[0.03] p-7">
            <p className="v1-mono text-xs uppercase tracking-widest text-white/40">{t("leftLabel")}</p>
            <ul className="mt-5 space-y-4">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/55">
                  <X size={18} className="mt-0.5 shrink-0 text-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-[20px] border border-[rgba(74,222,128,0.35)] bg-gradient-to-b from-[rgba(22,163,74,0.16)] to-[rgba(22,163,74,0.04)] p-7 shadow-[0_0_60px_rgba(22,163,74,0.15)]"
          >
            <p className="v1-mono text-xs uppercase tracking-widest text-[#4ade80]">{t("rightLabel")}</p>
            <ul className="mt-5 space-y-4">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white">
                  <Check size={18} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mx-auto mt-16 max-w-3xl text-center">
          <p className="v1-serif text-3xl leading-snug md:text-4xl">{t("reframeTitle")}</p>
          <p className="mt-4 text-lg leading-relaxed text-white/60">{t("reframeText")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
