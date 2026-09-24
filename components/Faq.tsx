import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

type FaqItem = { question: string; answer: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="bg-gray-950 py-10 md:py-12">
      <Container className="max-w-2xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-white">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-white">
                {item.question}
                <span className="ml-4 text-gray-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
