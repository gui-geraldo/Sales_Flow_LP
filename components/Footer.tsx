import { useLocale, useTranslations } from "next-intl";
import { PAGE_HREFS } from "./seo/links";
import { Container } from "./Container";
import { Logo, Wordmark } from "./Logo";
import { CookieSettingsLink } from "./CookieBanner";
import { COMPANY } from "@/lib/legal";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const privacyHref = "/privacy";

  // As páginas de busca só existem em espanhol; no pt e no en a coluna não aparece.
  const solutions =
    locale === "es"
      ? [
          {
            title: t("solutionsColumn"),
            links: [
              { label: t("links.clinics"), href: PAGE_HREFS.home },
              { label: t("links.crm"), href: PAGE_HREFS.crm },
              { label: t("links.multi"), href: PAGE_HREFS.multi },
            ],
          },
        ]
      : [];

  const columns: { title: string; links: { label: string; href: string }[]; cookieSettings?: boolean }[] = [
    ...solutions,
    {
      title: t("productColumn"),
      links: [
        { label: t("links.whatItDoes"), href: "#diferenciais" },
        { label: t("links.howItWorks"), href: "#como-funciona" },
        { label: t("links.pricing"), href: "#precos" },
        { label: t("links.security"), href: "#seguranca" },
      ],
    },
    {
      title: t("companyColumn"),
      links: [
        { label: t("links.faq"), href: "#faq" },
        { label: t("links.talkToUs"), href: "#cta" },
        { label: t("links.privacy"), href: privacyHref },
        { label: t("links.terms"), href: "/terms" },
      ],
      cookieSettings: true,
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-gray-950 pt-14">
      <Container>
        <div
          className={`grid gap-10 pb-12 ${
            solutions.length ? "sm:grid-cols-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]" : "md:grid-cols-[1.4fr_1fr_1fr]"
          }`}
        >
          <div className={solutions.length ? "sm:col-span-3 md:col-span-1" : undefined}>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <Wordmark withCompany />
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              {t("description")}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {column.cookieSettings && (
                  <li>
                    <CookieSettingsLink label={t("links.cookies")} />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* pb-24 no celular: o botão flutuante do WhatsApp (canto inferior
            direito) cobria o copyright no fim da página. */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pb-24 pt-6 text-sm text-gray-500 md:flex-row md:pb-6">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.name}. {t("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
