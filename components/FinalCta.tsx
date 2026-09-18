import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 py-20"
    >
      <div className="pointer-events-none absolute -top-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />

      <Container className="relative max-w-xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white">
            Pronto pra parar de perder cliente no WhatsApp?
          </h2>
          <p className="mt-3 text-brand-50">
            Comece a testar agora, sem cartão de crédito.
          </p>
          <CtaLink
            href="#"
            source="final_cta"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-[15px] font-semibold text-brand-700 shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-2xl"
          >
            Testar grátis
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  );
}
