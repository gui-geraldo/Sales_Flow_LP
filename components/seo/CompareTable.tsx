import { useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";

type Row = { aspect: string; without: string; with: string };

// Comparação lado a lado (ex.: "compartir el acceso" x "operación
// multiagente"). Uma estrutura só: três colunas no desktop, cartão por
// linha no celular (sem duplicar o texto na página).
export function CompareTable({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const rows = t.raw("rows") as Row[];
  const grid = "md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,4fr)_minmax(0,4fr)] md:gap-6";

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container className="max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div aria-hidden="true" className={`hidden pb-3 text-xs font-semibold uppercase tracking-wide ${grid}`}>
            <span />
            <span className="text-gray-500">{t("withoutLabel")}</span>
            <span className="text-brand-400">{t("withLabel")}</span>
          </div>
          <ul className="space-y-3 md:space-y-0">
            {rows.map((row) => (
              <li
                key={row.aspect}
                className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:px-0 md:py-4 ${grid}`}
              >
                <p className="font-semibold text-white">{row.aspect}</p>
                <p className="mt-3 flex gap-2 text-gray-400 md:mt-0">
                  <Minus size={16} className="mt-0.5 shrink-0 text-gray-600" aria-hidden />
                  <span>
                    <span className="sr-only">{t("withoutLabel")}: </span>
                    {row.without}
                  </span>
                </p>
                <p className="mt-2 flex gap-2 text-gray-200 md:mt-0">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-400" aria-hidden />
                  <span>
                    <span className="sr-only">{t("withLabel")}: </span>
                    {row.with}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
