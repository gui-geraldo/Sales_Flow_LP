import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";
import { Check, Info, AlertCircle } from "lucide-react";
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
    <section id="precos" className="bg-gray-25 py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-600">{t("subtitle")}</p>
        </Reveal>

        {isPlaceholder && (
          <Reveal className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning-text">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
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
                className={`rounded-xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isHighlighted
                    ? "border-brand-600 ring-1 ring-brand-600"
                    : "border-gray-200"
                }`}
              >
                {isHighlighted && (
                  <span className="mb-3 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {t("popular")}
                  </span>
                )}
                <h3 className="text-[15px] font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-medium text-gray-500">
                      {plan.period}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-600"
                        strokeWidth={2}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <CtaLink
                  href={isHighlighted && checkoutUrl ? checkoutUrl : "#cta"}
                  source={`pricing_${plan.name.toLowerCase()}_${currency}`}
                  className={`mt-7 flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${
                    isHighlighted
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </CtaLink>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
          <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
          <p>
            {t.rich("usageNote", {
              strong: (chunks) => <strong>{chunks}</strong>,
              fee: automationFee,
            })}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
