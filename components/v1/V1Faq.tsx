import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";

export function V1Faq() {
  const t = useTranslations("v1.faq");
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <section id="faq" className="py-24">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{t("title")}</h2>
        </Reveal>

        <Reveal delay={0.1} className="v1-faq mt-12 space-y-3">
          {items.map((item) => (
            <details key={item.question} className="v1-card !rounded-2xl px-6 py-5">
              <summary className="flex items-center justify-between gap-4 text-[17px] font-medium">
                {item.question}
                <Plus size={20} className="v1-faq-icon v1-ink-soft shrink-0 transition-transform duration-200" />
              </summary>
              <p className="v1-ink-soft mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
