import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { PAGE_LINKS } from "./links";

type Layer = { label: string; text: string; current?: boolean };

// Resposta direta à pergunta da página ("¿Qué es…?") em 2 ou 3 frases, pra
// quem busca e pros robôs de IA, seguida da escada "WhatsApp sozinho faz X,
// multiagente acrescenta Y, CRM acrescenta Z" (blueprint, seção 7). A camada
// da página atual fica destacada.
export function Definition({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const layers = t.raw("layers") as Layer[];

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container className="grid items-start gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-white">{t("question")}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-gray-300">{t.rich("answer", PAGE_LINKS)}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <ol className="relative space-y-3">
            {layers.map((layer, i) => (
              <li
                key={layer.label}
                className={`relative flex gap-4 rounded-xl border p-5 ${
                  layer.current
                    ? "border-brand-500/40 bg-brand-500/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    layer.current ? "bg-brand-500 text-gray-950" : "bg-white/10 text-gray-300"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${layer.current ? "text-brand-300" : "text-white"}`}>
                    {t.rich(`layers.${i}.label`, PAGE_LINKS)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{layer.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
