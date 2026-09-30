import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { PAGE_HREFS, PAGE_LINKS } from "./links";

// Ponte entre as páginas (blueprint, "Jornada interna"): um bloco com texto
// e um link contextual pra outra página. Ex.: "¿Tienes una clínica?" → home;
// "Del multiagente al CRM" → /crm-whatsapp.
export function Bridge({
  namespace,
  to,
}: {
  namespace: string;
  to: keyof typeof PAGE_HREFS;
}) {
  const t = useTranslations(namespace);
  const points = t.has("points") ? (t.raw("points") as string[]) : [];

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="grid items-center gap-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{t("eyebrow")}</p>
            <h2 className="mt-4 text-2xl font-bold leading-snug tracking-[-0.02em] text-white md:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-400">{t.rich("text", PAGE_LINKS)}</p>
            {t.has("proof") && (
              <p className="mt-5 border-l-2 border-brand-500 pl-4 text-[15px] font-medium text-gray-200">
                {t("proof")}
              </p>
            )}
          </div>

          <div>
            {points.length > 0 && (
              <ul className="space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-gray-300">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <a
              href={PAGE_HREFS[to]}
              className="group mt-6 inline-flex h-11 items-center gap-2 rounded border border-white/15 px-5 text-sm font-semibold text-gray-100 transition-[background-color,border-color] duration-200 ease-out hover:border-brand-500/60 hover:bg-brand-500/10"
            >
              {t("link")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
