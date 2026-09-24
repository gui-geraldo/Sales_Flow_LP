"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { HelpCircle, FileWarning, Users, ArrowRight, CheckCheck } from "lucide-react";

const withoutIcons = [FileWarning, Users, HelpCircle];
const WithIcon = CheckCheck;

export function Problem() {
  const t = useTranslations("problem");
  const withoutItems = t.raw("withoutItems") as string[];
  const withItems = t.raw("withItems") as string[];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-snug tracking-tight text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <div
          ref={ref}
          className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
        >
          <motion.div
            style={{ y: yLeft }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("withoutLabel")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              {withoutItems.map((item, i) => {
                const Icon = withoutIcons[i];
                return (
                  <li key={item} className="flex items-start gap-2">
                    <Icon size={16} className="mt-0.5 shrink-0 text-gray-500" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
              <ArrowRight size={18} strokeWidth={2.2} />
            </div>
          </div>

          <motion.div
            style={{ y: yRight }}
            className="rounded-xl border border-brand-500/30 bg-brand-500/[0.06] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">
              {t("withLabel")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-200">
              {withItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <WithIcon size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
