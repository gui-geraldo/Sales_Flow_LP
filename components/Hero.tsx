import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";
import {
  Megaphone,
  CheckCheck,
  Sparkles,
  Zap,
  Signal,
  Wifi,
  BatteryFull,
  Mic,
} from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white pt-16 md:pt-20">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_10%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-brand-300/40 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 left-[-10%] h-[360px] w-[360px] rounded-full bg-info/20 blur-[100px]" />
      <div className="pointer-events-none absolute top-10 right-[20%] h-[280px] w-[280px] rounded-full bg-purple/20 blur-[100px]" />

      <Container className="relative grid items-center gap-14 pb-24 md:grid-cols-2 md:pb-32">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            {t("badge")}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 md:text-[3.4rem]">
            {t("titleStart")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>{" "}
            {t("titleEnd")}
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink
              href="#cta"
              source="hero"
              className="inline-flex h-12 items-center justify-center rounded-md bg-brand-600 px-6 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30"
            >
              {t("ctaPrimary")}
            </CtaLink>
            <a
              href="#como-funciona"
              className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-[15px] font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              {t("ctaSecondary")}
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">{t("noCreditCard")}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-brand-200/50 via-info/10 to-transparent blur-3xl" />

            <div className="relative mx-auto h-[560px] w-[280px] overflow-hidden rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl shadow-gray-900/30">
              <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-2 text-[11px] font-medium text-white">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <Signal size={12} />
                  <Wifi size={12} />
                  <BatteryFull size={12} />
                </div>
              </div>
              <div className="absolute left-1/2 top-0 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-gray-900" />

              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-7 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                    {t("phone.contactName").charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">
                      {t("phone.contactName")}
                    </p>
                    <p className="text-[10px] text-white/70">online</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 overflow-hidden bg-[#efe7de] px-3 py-3">
                  <div className="mx-auto w-fit rounded-md bg-info-bg px-2.5 py-1 text-[10px] font-medium text-info-text shadow-sm">
                    <span className="inline-flex items-center gap-1">
                      <Megaphone size={11} strokeWidth={2} />
                      {t("phone.adOrigin")}
                    </span>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[78%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 text-[12px] text-gray-800 shadow-sm">
                      {t("phone.messageIncoming")}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[78%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-2.5 py-1.5 text-[12px] text-gray-900 shadow-sm">
                      {t("phone.messageOutgoing")}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[78%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 text-[12px] text-gray-800 shadow-sm">
                      {t("phone.messageConfirm")}
                    </div>
                  </div>

                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-md bg-success-bg px-2.5 py-1 text-[10px] font-semibold text-success-text shadow-sm">
                    <CheckCheck size={11} strokeWidth={2.2} />
                    {t("phone.aiTag")}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
                  <div className="h-8 flex-1 rounded-full bg-white px-3 text-[11px] leading-8 text-gray-400">
                    {t("phone.inputPlaceholder")}
                  </div>
                  <Mic size={18} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="animate-float absolute -left-16 top-16 hidden w-44 rounded-lg border border-gray-200 bg-white p-3 shadow-xl shadow-gray-900/10 lg:block">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                <Sparkles size={14} className="text-purple" strokeWidth={2} />
                {t("floatingAi.title")}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-gray-500">
                {t("floatingAi.description")}
              </p>
            </div>

            <div className="animate-float-delayed absolute -right-14 bottom-24 hidden w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-xl shadow-gray-900/10 lg:block">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                <Zap size={14} className="text-brand-600" strokeWidth={2} />
                {t("floatingStart.title")}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-gray-500">
                {t("floatingStart.description")}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
