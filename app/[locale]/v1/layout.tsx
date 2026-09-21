import type { Metadata } from "next";
import { Instrument_Serif, Geist_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import "./v1.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v1.meta" });

  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v1-root ${serif.variable} ${mono.variable}`}>{children}</div>
  );
}
