import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";
import { Check, Info } from "lucide-react";
import { getCurrencyConfig, type Currency } from "@/lib/pricing";

type Plan = {
  name: string;
  period: string;
  description: string;
  highlighted: boolean;
  features: string[];
  cta: string;
  price?: string;
};

export async function Pricing() {
  const t = await getTranslations("pricing");
  const plans = t.raw("plans") as Plan[];

  const cookieStore = await cookies();
  const currency = (cookieStore.get("NEXT_CURRENCY")?.value as Currency) || "BRL";
  const { amount, checkoutUrl, isPlaceholder, automationFee } = getCurrencyConfig(currency);

  return (
    <section id="precos" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 w-fit whitespace-nowrap text-gray-400">
            {t("subtitle")}
          </p>
        </Reveal>

        {isPlaceholder && (
          <Reveal className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-400">
            <Info size={16} className="mt-0.5 shrink-0 text-gray-500" />
            <p>{t("placeholderNotice")}</p>
          </Reveal>
        )}

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted;
            const price = isHighlighted ? amount : plan.price;

            return (
              <Reveal
                delay={i * 0.1}
                key={plan.name}
                className={`rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  isHighlighted
                    ? "border-brand-500 bg-brand-500/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {isHighlighted && (
                  <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
                    {t("popular")}
                  </span>
                )}
                <h3 className="text-[15px] font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-white">
                    {price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-medium text-gray-500">
                      {plan.period}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-400">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-400"
                        strokeWidth={2}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <CtaLink
                  href={isHighlighted && checkoutUrl ? checkoutUrl : "#cta"}
                  source={`pricing_${plan.name.toLowerCase()}_${currency}`}
                  className={`mt-7 flex h-10 items-center justify-center rounded px-4 text-sm font-semibold transition-colors ${
                    isHighlighted
                      ? "bg-brand-500 text-gray-950 hover:bg-brand-400"
                      : "border border-white/15 text-gray-200 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </CtaLink>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-6 max-w-3xl rounded-lg border border-white/10 bg-white/[0.03] p-5 text-center">
          <p className="text-sm font-semibold text-white">
            {t("commissionTitle")}
          </p>
          <p className="mt-1.5 text-sm text-gray-400">{t("commissionNote")}</p>
          <div className="mt-4 border-t border-white/10 pt-4 text-sm text-gray-400">
            <p>
              {t.rich("usageNote", {
                strong: (chunks) => <strong className="text-gray-200">{chunks}</strong>,
                fee: automationFee,
              })}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
