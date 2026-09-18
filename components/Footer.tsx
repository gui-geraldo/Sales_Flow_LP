import { Container } from "./Container";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "O que faz", href: "#diferenciais" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Preços", href: "#precos" },
      { label: "Segurança", href: "#seguranca" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Dúvidas frequentes", href: "#faq" },
      { label: "Falar com a gente", href: "#cta" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-25 pt-14">
      <Container>
        <div className="grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                Sales Flow
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              Marketing, atendimento e CRM num lugar só, do anúncio à venda,
              via WhatsApp.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 text-sm text-gray-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Sales Flow. Todos os direitos reservados.</p>
          <p className="text-gray-400">Feito no Brasil, para negócios que vendem no WhatsApp.</p>
        </div>
      </Container>
    </footer>
  );
}
