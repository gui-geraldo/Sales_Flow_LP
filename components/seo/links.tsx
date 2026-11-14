import type { ReactNode } from "react";

// Links internos entre a home e as páginas de busca, escritos dentro do
// próprio texto do i18n: "<crm>CRM para WhatsApp</crm>" vira link pra
// /crm-whatsapp. Usado com t.rich(chave, PAGE_LINKS). Texto sem a tag
// (ex.: pt e en) sai normal, sem link.
export const PAGE_HREFS = {
  home: "/",
  crm: "/crm-whatsapp",
  multi: "/whatsapp-multiagente",
  // Páginas em português do Brasil (anúncios do Google, 14/11/2026).
  crmbr: "/crm-para-whatsapp",
  multibr: "/whatsapp-multiatendimento",
  api: "/api-oficial-whatsapp",
} as const;

// Tabela oficial de preços da Meta (cobrança por mensagem desde 01/07/2025;
// regras de 01/10/2026 conferidas em 14/11/2026).
export const META_PRICING_URL = "https://developers.facebook.com/docs/whatsapp/pricing";

const linkClass =
  "font-medium text-brand-400 underline decoration-brand-500/40 underline-offset-[3px] transition-colors hover:text-brand-300 hover:decoration-brand-400";

const link = (href: string) => (chunks: ReactNode) => (
  <a href={href} className={linkClass}>
    {chunks}
  </a>
);

export const PAGE_LINKS = {
  home: link(PAGE_HREFS.home),
  crm: link(PAGE_HREFS.crm),
  multi: link(PAGE_HREFS.multi),
  crmbr: link(PAGE_HREFS.crmbr),
  multibr: link(PAGE_HREFS.multibr),
  api: link(PAGE_HREFS.api),
  meta: (chunks: ReactNode) => (
    <a href={META_PRICING_URL} target="_blank" rel="noopener" className={linkClass}>
      {chunks}
    </a>
  ),
  strong: (chunks: ReactNode) => <strong className="font-semibold text-white">{chunks}</strong>,
};

// Versão texto puro (JSON-LD, meta): tira as tags e deixa só o texto.
export const plainText = (text: string) =>
  text.replace(/<\/?(home|crm|multi|crmbr|multibr|api|meta|strong)>/g, "");
