import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Lock, Globe2, UserCog } from "lucide-react";

const icons = [Lock, Globe2, UserCog];

type Item = { title: string; description: string };

export function Security() {
  const t = useTranslations("security");
  const items = t.raw("items") as Item[];

  return (
    <section id="seguranca" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            <span className="h-px w-7 bg-brand-500" aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <div className="space-y-4">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal delay={i * 0.1} key={item.title}>
                <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-500/15 text-brand-400">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-400">
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
