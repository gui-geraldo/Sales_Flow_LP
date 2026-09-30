import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { DemoCaption } from "../DemoCaption";
import { Reveal } from "../Reveal";
import { PAGE_LINKS } from "./links";

// Texto + tela da plataforma lado a lado (mesma ideia do ClinicResults):
// a tela avança pela margem da página e o texto fica parado ao lado
// enquanto ela rola. `side` diz de que lado fica a tela.
export function Showcase({
  namespace,
  side = "left",
  children,
}: {
  namespace: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const t = useTranslations(namespace);
  const bullets = t.has("bullets") ? (t.raw("bullets") as string[]) : [];
  const left = side === "left";

  return (
    <section className="overflow-x-clip border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container
        className={`grid items-start gap-12 ${
          left ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        }`}
      >
        <Reveal className={`order-2 ${left ? "bleed-left md:order-1" : "hero-bleed-right md:order-2"}`}>
          <figure
            data-nosnippet
            className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]"
          >
            <DemoCaption />
            {children}
          </figure>
        </Reveal>

        <Reveal className={`order-1 md:sticky md:top-28 ${left ? "md:order-2" : "md:order-1"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-400">{t.rich("subtitle", PAGE_LINKS)}</p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((_, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-snug text-gray-200">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  <span>{t.rich(`bullets.${i}`, PAGE_LINKS)}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
