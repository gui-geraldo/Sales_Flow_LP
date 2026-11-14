import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { PAGE_LINKS } from "./links";

type Item = { label: string; value: string; detail: string };

// "Quanto custa" da página da API oficial (14/11/2026): uma linha por
// custo, separando o que é nosso (plano, automação) do que a Meta cobra
// direto no cartão do cliente. Só fatos conferidos na tabela oficial da
// Meta; valor por mensagem não aparece (depende do tipo e muda de tempos
// em tempos), vai o link da tabela.
export function CostList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const items = t.raw("items") as Item[];

  return (
    <section id="custos" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container className="max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
            {items.map((item, i) => (
              <li key={item.label} className="grid gap-1 p-5 md:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] md:gap-6">
                <div>
                  <p className="text-[15px] font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {t.rich(`items.${i}.detail`, PAGE_LINKS)}
                  </p>
                </div>
                <p className="text-[15px] font-semibold text-brand-300 md:text-right">{item.value}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-center text-sm leading-relaxed text-gray-500">{t.rich("note", PAGE_LINKS)}</p>
        </Reveal>
      </Container>
    </section>
  );
}
