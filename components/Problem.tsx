import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { HelpCircle, FileWarning, Users, ArrowRight, CheckCheck } from "lucide-react";

const withoutIcons = [FileWarning, Users, HelpCircle];
const WithIcon = CheckCheck;

export function Problem() {
  const t = useTranslations("problem");
  const withoutItems = t.raw("withoutItems") as string[];
  const withItems = t.raw("withItems") as string[];

  return (
    <section className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Reveal delay={0.05} className="rounded-xl border border-gray-200 bg-gray-25 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("withoutLabel")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {withoutItems.map((item, i) => {
                const Icon = withoutIcons[i];
                return (
                  <li key={item} className="flex items-start gap-2">
                    <Icon size={16} className="mt-0.5 shrink-0 text-gray-400" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <ArrowRight size={18} strokeWidth={2.2} />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="rounded-xl border border-brand-200 bg-brand-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {t("withLabel")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {withItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <WithIcon size={16} className="mt-0.5 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
