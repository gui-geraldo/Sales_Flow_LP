import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { COMPANY, LEGAL_UPDATED_AT, type LegalDoc, type LegalVariant } from "@/lib/legal";

// Página de texto legal (política de privacidade e termos de uso): cabeçalho
// simples, sumário com âncoras e seções numeradas.

// O e-mail de contato vira link onde aparecer no texto.
function withEmailLink(text: string) {
  const parts = text.split(COMPANY.email);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a
            key={i}
            href={`mailto:${COMPANY.email}`}
            className="text-gray-100 underline underline-offset-2 hover:text-white"
          >
            {COMPANY.email}
          </a>,
          part,
        ],
  );
}

export function LegalDocument({ doc, variant }: { doc: LegalDoc; variant: LegalVariant }) {
  const updated = new Intl.DateTimeFormat(variant, { dateStyle: "long" }).format(
    new Date(`${LEGAL_UPDATED_AT}T12:00:00`),
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-300">
      <header className="border-b border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-[15px] font-semibold tracking-tight text-white">Sales Flow</span>
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-white">
            {doc.back}
          </a>
        </Container>
      </header>

      <Container className="py-12 md:py-16">
        <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-gray-500">{doc.updated.replace("{date}", updated)}</p>
        {doc.intro.map((paragraph) => (
          <p key={paragraph} className="mt-6 text-[15px] leading-relaxed">
            {withEmailLink(paragraph)}
          </p>
        ))}

        <nav aria-label={doc.toc} className="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{doc.toc}</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {doc.sections.map((section, i) => (
              <li key={section.title}>
                <a href={`#s${i + 1}`} className="text-gray-400 hover:text-white">
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section, i) => (
          <section key={section.title} id={`s${i + 1}`} className="mt-10 scroll-mt-6">
            <h2 className="text-lg font-semibold text-white">
              {i + 1}. {section.title}
            </h2>
            {section.body.map((block, j) =>
              typeof block === "string" ? (
                <p key={j} className="mt-3 text-[15px] leading-relaxed">
                  {withEmailLink(block)}
                </p>
              ) : (
                <ul key={j} className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed marker:text-gray-600">
                  {block.map((item) => (
                    <li key={item}>{withEmailLink(item)}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
        </div>
      </Container>
    </main>
  );
}
