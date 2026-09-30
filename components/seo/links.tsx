import type { ReactNode } from "react";

// Links internos entre a home e as páginas de busca, escritos dentro do
// próprio texto do i18n: "<crm>CRM para WhatsApp</crm>" vira link pra
// /crm-whatsapp. Usado com t.rich(chave, PAGE_LINKS). Texto sem a tag
// (ex.: pt e en) sai normal, sem link.
export const PAGE_HREFS = {
  home: "/",
  crm: "/crm-whatsapp",
  multi: "/whatsapp-multiagente",
} as const;

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
  strong: (chunks: ReactNode) => <strong className="font-semibold text-white">{chunks}</strong>,
};

// Versão texto puro (JSON-LD, meta): tira as tags e deixa só o texto.
export const plainText = (text: string) => text.replace(/<\/?(home|crm|multi|strong)>/g, "");
