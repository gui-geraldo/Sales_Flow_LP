"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../Container";
import { CtaLink } from "../CtaLink";
import { PlatformMockup } from "../mockup/PlatformMockup";

// Exponential ease-out (Emil Kowalski / craft-floor guidance: strong ease-out
// reads as "already in motion", never sluggish ease-in). One authored
// staggered entrance for the whole hero column, not four identical Reveal
// blocks firing at once.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.02 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export function ClinicHero() {
  const t = useTranslations("clinic.hero");

  return (
    <section className="border-b border-white/10 bg-gray-950 pt-8 selection:bg-brand-500/30 selection:text-white md:pt-10">
      <Container className="grid items-start gap-14 pb-10 md:grid-cols-2 md:pb-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px", amount: 0.2 }}
          className="flex flex-col md:min-h-[480px] md:justify-between"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400"
          >
            <span className="h-px w-7 bg-brand-500" aria-hidden="true" />
            {t("badge")}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-8 text-[2.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-white md:mt-0 md:text-[3.75rem]"
          >
            {t("titleStart")}{" "}
            <span className="text-brand-400">{t("titleEmphasis")}</span>{" "}
            {t("titleEnd")}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-lg text-lg leading-relaxed text-gray-400 md:mt-0"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div variants={item} className="mt-8 md:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink
                href="#cta"
                source="clinic_hero_Clinic"
                className="inline-flex h-12 items-center justify-center rounded bg-brand-500 px-6 text-[15px] font-semibold text-gray-950 transition-[background-color,transform] duration-200 ease-out hover:bg-brand-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {t("ctaPrimary")}
              </CtaLink>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center justify-center rounded border border-white/15 px-6 text-[15px] font-semibold text-gray-200 transition-[background-color,border-color,transform] duration-200 ease-out hover:border-white/30 hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {t("ctaSecondary")}
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">{t("noCreditCard")}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px", amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT_EXPO }}
          className="hero-bleed-right"
        >
          {/* Mockup animado da bandeja real da plataforma (components/mockup). */}
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
            <PlatformMockup />
          </figure>
        </motion.div>
      </Container>
    </section>
  );
}
