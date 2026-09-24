"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../Container";
import { MEDIA_WARMUP_EVENT, MediaClip } from "../MediaClip";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Stat = { value: string; label: string };

// Mezcla de fotos y videos cortos de equipo/eventos. Sin `src`, cada slot
// muestra el placeholder; para publicar el archivo real, poné el video o
// la foto en /public y completá `src` (y `poster` para el video) acá.
// Fotos já otimizadas (720×720 JPG, ~100 KB) — servidas direto, sem esperar
// o otimizador do next/image; originais pesados em /_midia_originais.
const mediaSlots: { type: "photo" | "video"; src?: string; poster?: string }[] = [
  { type: "video", src: "/team/Video_1.mp4", poster: "/team/Video_1_Cover.jpg" },
  { type: "photo", src: "/team/Photo_1.jpg" },
  { type: "photo", src: "/team/Photo_2.jpg" },
  { type: "photo", src: "/team/Photo_3.jpg" },
  { type: "photo", src: "/team/Photo_5.jpg" },
  { type: "photo", src: "/team/Photo_4.jpg" },
  { type: "video", src: "/team/Video_2.mp4", poster: "/team/Video_2_Cover.jpg" },
  { type: "photo", src: "/team/Photo_7.jpg" },
];

export function ClinicAbout() {
  const t = useTranslations("clinic.about");
  const stats = t.raw("stats") as Stat[];
  const [paused, setPaused] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Quando a linha de números entra na tela, avisa os vídeos do carrossel
  // pra começarem a carregar já (se a página ainda não tiver terminado de
  // carregar e disparado isso antes).
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.dispatchEvent(new Event(MEDIA_WARMUP_EVENT));
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:whitespace-nowrap">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6 text-center"
            >
              <p className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-gray-400 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Revela antes de entrar na tela (margem de 300px abaixo do
            viewport ≈ quando a linha de números aparece) — antes esperava
            30% do carrossel visível e parecia uma faixa vazia até a metade. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-10 max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          {/* The list is rendered twice so the marquee loops seamlessly; the
              second copy is decorative and hidden from assistive tech. */}
          {/* Click (or Enter/Space) toggles the marquee on and off. */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={paused}
            aria-label={t("carouselToggle")}
            onClick={() => setPaused((p) => !p)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPaused((p) => !p);
              }
            }}
            className={`animate-marquee-right flex w-max cursor-pointer ${paused ? "is-paused" : ""}`}
          >
            {[0, 1].map((copy) =>
              mediaSlots.map((slot, i) => (
                <div
                  key={`${copy}-${i}`}
                  aria-hidden={copy === 1 || undefined}
                  className="w-[62vw] shrink-0 pr-3 sm:w-[calc(min(100vw_-_3rem,64rem)/3)] sm:pr-4"
                >
                  <MediaClip
                    type={slot.type}
                    src={slot.src}
                    poster={slot.poster}
                    alt={copy === 0 ? t("photoAlt") : ""}
                    label={slot.type === "video" ? t("videoLabel") : t("photoLabel")}
                    caption={slot.type === "video" ? t("videoCaption") : t("photoCaption")}
                  />
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.24, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-10 max-w-5xl text-center text-[15px] leading-relaxed text-gray-400"
        >
          {t("text")}
        </motion.p>
      </Container>
    </section>
  );
}
