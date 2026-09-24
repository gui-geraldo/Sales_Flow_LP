"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../Container";
import { RoiMockup } from "../mockup/RoiMockup";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Tela de Resultados (/roi) da plataforma, logo abaixo do "Quiénes somos":
// mockup animado à esquerda (avançando pela margem, como o do Hero faz à
// direita) e o texto à direita.
export function ClinicResults({
  namespace = "clinic.results",
}: {
  /** texto da coluna da direita — "clinic.results" (es/en) ou "results" (pt, genérico) */
  namespace?: "clinic.results" | "results";
}) {
  const t = useTranslations(namespace);
  const bullets = t.raw("bullets") as string[];

  return (
    <section className="overflow-x-clip border-b border-white/10 bg-gray-950 py-10 md:py-12">
      {/* items-start + coluna de texto sticky: no desktop o texto fica parado
          enquanto o mockup (mais alto) rola ao lado, e só sai junto com o fim
          dele. overflow-x-clip na seção não cria contêiner de rolagem, então
          não quebra o sticky. */}
      <Container className="grid items-start gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 200px 0px" }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="bleed-left order-2 md:order-1"
        >
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
            <RoiMockup />
          </figure>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="order-1 md:sticky md:top-28 md:order-2"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-400">{t("subtitle")}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-snug text-gray-200">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
