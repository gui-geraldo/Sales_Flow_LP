import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Check, Info } from "lucide-react";

const plans = [
  {
    name: "Profissional",
    price: "R$ 497",
    period: "/mês",
    description: "Pra negócios que já anunciam e vendem pelo WhatsApp todo dia.",
    highlighted: true,
    features: [
      "Rastreamento ilimitado de anúncios (Meta Ads e Google Ads)",
      "2 caixas de atendimento (ex.: Comercial, Suporte)",
      "Até 10 pessoas da equipe",
      "IA por caixa, com follow-up automático",
      "Automações de pagamento e cobrança",
    ],
  },
  {
    name: "Escala",
    price: "Sob consulta",
    period: "",
    description: "Pra operações maiores, com necessidade de algo sob medida.",
    highlighted: false,
    features: [
      "Tudo do Profissional",
      "Onboarding assistido pela nossa equipe",
      "Integrações personalizadas",
      "Limites de caixas e equipe combinados com você",
    ],
  },
];

export function Pricing() {
  return (
    <section id="precos" className="bg-gray-25 py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Um preço simples, sem letra miúda
          </h2>
          <p className="mt-3 text-gray-600">
            Assinatura fixa mensal. Sem surpresa, sem plano escondido atrás
            de "fale com vendas" pra tudo.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal
              delay={i * 0.1}
              key={plan.name}
              className={`rounded-xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted
                  ? "border-brand-600 ring-1 ring-brand-600"
                  : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  Mais popular
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm font-medium text-gray-500">
                    {plan.period}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-brand-600"
                      strokeWidth={2}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-7 flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.highlighted ? "Testar grátis" : "Falar com a gente"}
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
          <Info size={16} className="mt-0.5 shrink-0 text-gray-400" />
          <p>
            Além da assinatura, cada automação (follow-up enviado, disparo por
            contato ou webhook acionado) custa <strong>R$ 0,02</strong>. O
            envio da mensagem em si você já paga direto à Meta, sem
            intermediário nosso — cobramos só pela orquestração.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
