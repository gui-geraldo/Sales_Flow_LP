"use client";

import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { Megaphone, Zap, BadgeCheck, ArrowRight } from "lucide-react";

const backgrounds = ["bg-info-bg", "bg-warning-bg", "bg-purple-bg", "bg-success-bg"];

type Item = {
  title: string;
  description: string;
  tag?: string;
  hot?: string;
  warm?: string;
  cold?: string;
  problem?: string;
  paid?: string;
};

export function ClinicDifferentiators() {
  const t = useTranslations("clinic.differentiators");
  const items = t.raw("items") as Item[];

  return (
    <section id="diferenciais" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-400 sm:whitespace-nowrap">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => {
            const bg = backgrounds[i];

            return (
              <Reveal delay={i * 0.07} key={item.title}>
                <div className="group overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.65)]">
                  <div
                    className={`flex h-28 items-center justify-center px-6 transition-transform duration-300 ease-out group-hover:scale-[1.03] ${bg}`}
                  >
                    {i === 0 && (
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white shadow-sm">
                          <Megaphone size={20} className="text-info" strokeWidth={1.8} />
                        </div>
                        <ArrowRight size={16} className="text-gray-300" />
                        <div className="rounded-md bg-white px-3 py-2 text-[13px] font-medium text-gray-700 shadow-sm">
                          {item.tag}
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-warning-text shadow-sm">
                        <Zap size={20} className="text-warning" strokeWidth={2} />
                        {item.tag}
                      </div>
                    )}
                    {i === 2 && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                          {item.cold}
                        </span>
                        <span className="rounded-full bg-warning-bg px-3 py-1.5 text-xs font-semibold text-warning-text">
                          {item.warm}
                        </span>
                        <span className="rounded-full bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text">
                          {item.hot}
                        </span>
                        <span className="rounded-full bg-info-bg px-3 py-1.5 text-xs font-semibold text-info-text">
                          {item.paid}
                        </span>
                        <span className="rounded-full bg-error-bg px-3 py-1.5 text-xs font-semibold text-error-text">
                          {item.problem}
                        </span>
                      </div>
                    )}
                    {i === 3 && (
                      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-success-text shadow-sm">
                        <BadgeCheck size={20} className="text-success" strokeWidth={2} />
                        {item.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-[15px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
