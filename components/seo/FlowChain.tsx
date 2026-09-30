import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";

type Step = { label: string; text: string };

// O caminho da mensagem até o resultado, um passo por coluna no desktop e
// em lista no celular. O último passo (o resultado) fica em verde.
export function FlowChain({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const steps = t.raw("steps") as Step[];

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <ol className="mt-12 grid gap-3 md:grid-cols-7 md:gap-2">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            return (
              <li key={step.label} className="relative">
                <Reveal
                  delay={i * 0.06}
                  className={`flex h-full gap-3 rounded-lg border p-4 md:flex-col md:gap-2 ${
                    last ? "border-brand-500/40 bg-brand-500/[0.08]" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold tabular-nums ${last ? "text-brand-400" : "text-gray-500"}`}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${last ? "text-brand-300" : "text-white"}`}>{step.label}</p>
                    <p className="mt-1 text-[13px] leading-snug text-gray-400">{step.text}</p>
                  </div>
                </Reveal>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[7px] top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-white/20 bg-gray-950 md:block"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
