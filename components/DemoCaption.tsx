import { useTranslations } from "next-intl";

// Legenda invisível na tela das telas de demonstração: avisa leitores de
// tela, buscadores e robôs de IA que nomes e números ali são fictícios.
export function DemoCaption() {
  const t = useTranslations("demo");
  return <figcaption className="sr-only">{t("note")}</figcaption>;
}
