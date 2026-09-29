import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/LegalDocument";
import { PRIVACY } from "@/content/legal/privacy";
import { legalVariant } from "@/lib/legal";
import { getRequestCurrency } from "@/lib/request-currency";

// pt do Brasil segue a LGPD; pt com EUR (Portugal), es e en seguem o RGPD.
async function variantFor(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  return { locale, variant: legalVariant(locale, await getRequestCurrency()) };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { variant } = await variantFor(params);
  return { title: PRIVACY[variant].metaTitle, alternates: { canonical: "/privacy" } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, variant } = await variantFor(params);
  setRequestLocale(locale);
  return <LegalDocument doc={PRIVACY[variant]} variant={variant} />;
}
