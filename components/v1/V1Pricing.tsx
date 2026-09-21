import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Check, Info, AlertCircle } from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { CtaLink } from "../CtaLink";
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

export async function V1Pricing() {
  const t = await getTranslations("v1.pricing");
  const plans = t.raw("plans") as Plan[];

  const cookieStore = await cookies();
  const currency = (cookieStore.get("NEXT_CURRENCY")?.value as Currency) || "BRL";
  const { amount, checkoutUrl, isPlaceholder, automationFee } = getCurrencyConfig(currency);

  return (
    <section id="pricing" className="v1-bg-alt py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{t("title")}</h2>
          <p className="v1-ink-soft mt-4 text-lg">{t("subtitle")}</p>
        </Reveal>

        {isPlaceholder && (
          <Reveal className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning-text">
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
                key={plan.name}
                delay={i * 0.1}
                className={`v1-card v1-card-lift p-8 ${
                  isHighlighted ? "!shadow-[0_0_0_2px_var(--v1-accent),0_18px_40px_rgba(22,163,74,0.14)]" : ""
                }`}
              >
                {isHighlighted && (
                  <span className="v1-mono mb-4 inline-block rounded-full bg-[rgba(22,163,74,0.12)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#15803d]">
                    {t("popular")}
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-semibold tracking-tight">{price}</span>
                  {plan.period && <span className="v1-ink-soft text-sm font-medium">{plan.period}</span>}
                </p>
                <p className="v1-ink-soft mt-2 text-sm">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-[var(--v1-accent)]" strokeWidth={2.2} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <CtaLink
                  href={isHighlighted && checkoutUrl ? checkoutUrl : "#cta"}
                  source={`v1_pricing_${isHighlighted ? "pro" : "scale"}_${currency}`}
                  className={`v1-btn mt-8 w-full ${isHighlighted ? "v1-btn-accent" : "v1-btn-ghost"}`}
                >
                  {plan.cta}
                </CtaLink>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="v1-card mx-auto mt-6 flex max-w-3xl items-start gap-2.5 !rounded-xl p-4 text-sm">
          <Info size={16} className="v1-ink-soft mt-0.5 shrink-0" />
          <p className="v1-ink-soft">
            {t.rich("usageNote", {
              strong: (chunks) => <strong className="text-[var(--v1-ink)]">{chunks}</strong>,
              fee: automationFee,
            })}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
