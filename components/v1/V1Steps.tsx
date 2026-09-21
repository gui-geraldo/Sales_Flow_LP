import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { FillBar } from "./FillBar";

export function V1Steps() {
  const t = useTranslations("v1.steps");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section id="steps" className="v1-bg-alt py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="v1-mono v1-accent text-xs uppercase tracking-widest">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{t("title")}</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="v1-card v1-card-lift p-7">
              <p className="v1-mono text-sm font-medium">0{i + 1}</p>
              <div className="mt-3">
                <FillBar delay={0.3 + i * 0.25} />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-snug">{item.title}</h3>
              <p className="v1-ink-soft mt-3 leading-relaxed">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
