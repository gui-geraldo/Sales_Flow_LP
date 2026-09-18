import { Container } from "./Container";
import { Reveal } from "./Reveal";

const steps = [
  {
    number: "1",
    title: "Conecte seu WhatsApp e seus anúncios",
    description:
      "Use o número que já tem, sem esperar aprovação. Conecte sua conta de Meta Ads em poucos cliques.",
  },
  {
    number: "2",
    title: "Cada conversa já chega com contexto",
    description:
      "Sua equipe vê de qual anúncio o cliente veio, e a IA ajuda a responder e separar quem tá pronto pra comprar.",
  },
  {
    number: "3",
    title: "Acompanhe tudo em um painel só",
    description:
      "Do clique no anúncio até a venda fechada, sem trocar de ferramenta nem perder informação pelo caminho.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Como funciona
          </h2>
          <p className="mt-3 text-gray-600">Três passos, sem complicação.</p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent md:block" />

          {steps.map((step, i) => (
            <Reveal delay={i * 0.1} key={step.number} className="relative text-center md:text-left">
              <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-md shadow-brand-600/30 md:mx-0">
                {step.number}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
