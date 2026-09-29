import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { PRODUCT, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: locale === "es" || locale === "en" ? "clinic.meta" : "meta",
  });

  const ogLocale = { pt: "pt_BR", es: "es_ES", en: "en_US" }[locale] ?? "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: PRODUCT,
    openGraph: {
      type: "website",
      siteName: PRODUCT,
      title: t("title"),
      description: t("description"),
      locale: ogLocale,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: PRODUCT }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Widget de rastreamento do Sales Flow (conta w=507cba10…), pedido do
            usuário: tag exatamente como fornecida, uma vez, em todas as páginas.
            Não baixar, reescrever nem substituir. */}
        <script src="https://staging.talkerflow.me/api/widget.js?w=507cba10-f4db-41f7-b764-26867166750d" defer></script>
      </head>
      <body className="font-sans">
        <NextIntlClientProvider>
          {children}
          <CookieBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
