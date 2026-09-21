import { useTranslations } from "next-intl";
import { Container } from "../Container";
import { Logo } from "../Logo";
import { CtaLink } from "../CtaLink";
import { LanguageSwitcher } from "../LanguageSwitcher";

export function V1Header() {
  const t = useTranslations("v1.nav");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--v1-line)] bg-[rgba(252,252,253,0.8)] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-[15px] font-semibold tracking-tight">Sales Flow</span>
        </div>

        <nav className="v1-ink-soft hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#features" className="hover:text-[var(--v1-ink)]">{t("features")}</a>
          <a href="#steps" className="hover:text-[var(--v1-ink)]">{t("steps")}</a>
          <a href="#pricing" className="hover:text-[var(--v1-ink)]">{t("pricing")}</a>
          <a href="#faq" className="hover:text-[var(--v1-ink)]">{t("faq")}</a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CtaLink
            href="#cta"
            source="v1_header"
            className="v1-btn hidden !h-10 !px-5 !text-sm sm:inline-flex"
          >
            {t("cta")}
          </CtaLink>
        </div>
      </Container>
    </header>
  );
}
