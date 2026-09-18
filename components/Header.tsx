import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CtaLink } from "./CtaLink";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            Sales Flow
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#diferenciais" className="hover:text-gray-900">
            {t("whatItDoes")}
          </a>
          <a href="#como-funciona" className="hover:text-gray-900">
            {t("howItWorks")}
          </a>
          <a href="#precos" className="hover:text-gray-900">
            {t("pricing")}
          </a>
          <a href="#faq" className="hover:text-gray-900">
            {t("faq")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CtaLink
            href="#cta"
            source="header"
            className="inline-flex h-10 items-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            {t("ctaFree")}
          </CtaLink>
        </div>
      </Container>
    </header>
  );
}
