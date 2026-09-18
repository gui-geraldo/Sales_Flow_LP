import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

type FaqItem = { question: string; answer: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="py-20">
      <Container className="max-w-2xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
          {items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-gray-900">
                {item.question}
                <span className="ml-4 text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
