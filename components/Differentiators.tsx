import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Megaphone, Zap, Sparkles, BadgeCheck, ArrowRight } from "lucide-react";

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

export function Differentiators() {
  const t = useTranslations("differentiators");
  const items = t.raw("items") as Item[];

  return (
    <section id="diferenciais" className="border-b border-white/10 bg-gray-950 py-14">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-400 sm:whitespace-nowrap">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => {
            const bg = backgrounds[i];

            return (
              <Reveal delay={i * 0.08} key={item.title}>
                <div className="group overflow-hidden rounded-xl border border-white/10 bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div
                    className={`flex h-28 items-center justify-center px-6 transition-transform duration-300 group-hover:scale-[1.03] ${bg}`}
                  >
                    {i === 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm">
                          <Megaphone size={16} className="text-info" strokeWidth={1.8} />
                        </div>
                        <ArrowRight size={14} className="text-gray-300" />
                        <div className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm">
                          {item.tag}
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-warning-text shadow-sm">
                        <Zap size={14} className="text-warning" strokeWidth={2} />
                        {item.tag}
                      </div>
                    )}
                    {i === 2 && (
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                          {item.cold}
                        </span>
                        <span className="rounded-full bg-warning-bg px-2.5 py-1 text-[10px] font-semibold text-warning-text">
                          {item.warm}
                        </span>
                        <span className="rounded-full bg-success-bg px-2.5 py-1 text-[10px] font-semibold text-success-text">
                          {item.hot}
                        </span>
                        <span className="rounded-full bg-info-bg px-2.5 py-1 text-[10px] font-semibold text-info-text">
                          {item.paid}
                        </span>
                        <span className="rounded-full bg-error-bg px-2.5 py-1 text-[10px] font-semibold text-error-text">
                          {item.problem}
                        </span>
                      </div>
                    )}
                    {i === 3 && (
                      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-success-text shadow-sm">
                        <BadgeCheck size={14} className="text-success" strokeWidth={2} />
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
