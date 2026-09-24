import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");

  const columns = [
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
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-gray-950 pt-14">
      <Container>
        <div className="grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Sales Flow
              </span>
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
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-gray-500 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Sales Flow. {t("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
