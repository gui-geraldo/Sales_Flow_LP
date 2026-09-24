"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../Container";
import { MediaClip } from "../MediaClip";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Stat = { value: string; label: string };

// Mezcla de fotos y videos cortos de equipo/eventos. Sin `src`, cada slot
// muestra el placeholder; para publicar el archivo real, poné el video o
// la foto en /public y completá `src` (y `poster` para el video) acá.
const mediaSlots: { type: "photo" | "video"; src?: string; poster?: string }[] = [
  { type: "video", src: "/team/Video_1.mp4", poster: "/team/Video_1_Cover.jpg" },
  { type: "photo", src: "/team/Photos_1.png" },
  { type: "photo", src: "/team/Photos_2.png" },
  { type: "photo", src: "/team/Photos_3.png" },
  { type: "photo", src: "/team/Photos_5.jpg" },
  { type: "photo", src: "/team/Photo_4.png" },
  { type: "video", src: "/team/Video_2.mp4", poster: "/team/Video_2_Cover.jpg" },
  { type: "photo", src: "/team/Photo_7.png" },
];

export function ClinicAbout() {
  const t = useTranslations("clinic.about");
  const stats = t.raw("stats") as Stat[];
  const [paused, setPaused] = useState(false);

  return (
    <section className="border-b border-white/10 bg-gray-950 py-16 md:py-20">
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px", amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.16, ease: EASE_OUT_EXPO }}
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
          className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-gray-400"
        >
          {t("text")}
        </motion.p>
      </Container>
    </section>
  );
}
