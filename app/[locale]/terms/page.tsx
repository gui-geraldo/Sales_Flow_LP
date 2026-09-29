import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/LegalDocument";
import { TERMS } from "@/content/legal/terms";
import { legalVariant } from "@/lib/legal";
import { getRequestCurrency } from "@/lib/request-currency";

async function variantFor(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  return { locale, variant: legalVariant(locale, await getRequestCurrency()) };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { variant } = await variantFor(params);
  return { title: TERMS[variant].metaTitle };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, variant } = await variantFor(params);
  setRequestLocale(locale);
  return <LegalDocument doc={TERMS[variant]} variant={variant} />;
}
