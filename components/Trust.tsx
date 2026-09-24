import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Trust() {
  const t = useTranslations("trust");
  const names = t.raw("names") as string[];

  return (
    <section className="border-b border-white/10 bg-gray-950 py-10">
      <Container>
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t("label")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
            {names.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
