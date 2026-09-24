import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

type Step = { title: string; description: string };

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="como-funciona" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

          {steps.map((step, i) => (
            <Reveal delay={i * 0.1} key={step.title} className="relative text-center md:text-left">
              <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-gray-950 md:mx-0">
                {i + 1}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
