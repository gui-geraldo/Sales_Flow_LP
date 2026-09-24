import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CtaLink } from "./CtaLink";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Sales Flow
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-400 md:flex">
          <a href="#diferenciais" className="hover:text-white">
            {t("whatItDoes")}
          </a>
          <a href="#como-funciona" className="hover:text-white">
            {t("howItWorks")}
          </a>
          <a href="#precos" className="hover:text-white">
            {t("pricing")}
          </a>
          <a href="#faq" className="hover:text-white">
            {t("faq")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <CtaLink
            href="#cta"
            source="header"
            className="inline-flex h-10 items-center rounded bg-brand-500 px-4 text-sm font-semibold text-gray-950 transition-colors hover:bg-brand-400"
          >
            {t("ctaFree")}
          </CtaLink>
        </div>
      </Container>
    </header>
  );
}
