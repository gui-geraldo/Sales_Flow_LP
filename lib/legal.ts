// Dados da empresa exibidos na política de privacidade e nos termos de uso.
// Mesmos dados dos documentos legais da plataforma (talker_flow_many_2.0).
export const COMPANY = {
  name: "Talker Flow Tecnologia",
  cnpj: "37.819.469/0001-67",
  email: "contato@talkerflow.me",
  site: "talkerflow.me",
};

export const LEGAL_UPDATED_AT = "2026-09-29";

// Qual texto legal mostrar: pt do Brasil (LGPD), pt de Portugal (pt com EUR,
// RGPD), espanhol (RGPD + LSSI) ou inglês.
export type LegalVariant = "pt-BR" | "pt-PT" | "es" | "en";

export function legalVariant(locale: string, currency: string): LegalVariant {
  if (locale === "pt") return currency === "EUR" ? "pt-PT" : "pt-BR";
  return locale === "es" ? "es" : "en";
}

// Um bloco é um parágrafo; uma lista de strings vira lista com marcadores.
export type LegalBlock = string | string[];

export type LegalDoc = {
  metaTitle: string;
  title: string;
  updated: string; // com {date}
  back: string;
  toc: string;
  intro: string[];
  sections: { title: string; body: LegalBlock[] }[];
};
