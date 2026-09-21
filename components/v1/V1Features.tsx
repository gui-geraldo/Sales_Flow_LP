import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { Emph } from "./Emph";

type Feature = {
  label: string;
  title: string;
  description: string;
  timeline: { time: string; text: string }[];
};

export function V1Features() {
  const t = useTranslations("v1.features");
  const items = t.raw("items") as Feature[];

  return (
    <section id="features" className="py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="v1-mono v1-accent text-xs uppercase tracking-widest">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{t("title")}</h2>
        </Reveal>

        <div className="mt-20 space-y-24">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <p className="v1-mono v1-accent text-xs font-medium tracking-widest">{item.label}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight md:text-4xl">
                  <Emph text={item.title} className="v1-serif v1-gradient-text" />
                </h3>
                <p className="v1-ink-soft mt-4 text-lg leading-relaxed">{item.description}</p>
              </Reveal>

              <Reveal delay={0.1} className="v1-card v1-card-lift p-6">
                <div className="flex items-center justify-between border-b border-[var(--v1-line)] pb-4">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7eb]" />
                  </span>
                  <span className="v1-mono v1-ink-soft text-[10px] uppercase tracking-wider">
                    {t("illustrative")}
                  </span>
                </div>

                <ol className="mt-5 space-y-4">
                  {item.timeline.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="v1-mono mt-0.5 w-24 shrink-0 rounded-md bg-[rgba(22,163,74,0.1)] px-2 py-1 text-center text-[11px] font-medium text-[#15803d]">
                        {step.time}
                      </span>
                      <span className="pt-1 text-[15px] leading-snug">{step.text}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
