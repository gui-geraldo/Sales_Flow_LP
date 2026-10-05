import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { Check } from "lucide-react";

// Variante privada da seção de planos, montada para uma integradora
// específica (em espanhol). Não entra na LP pública nem nas traduções.
type PartnerPlan = {
  name: string;
  price: string;
  size: string[];
  ai: string;
  languages: string;
  inheritsFrom?: string;
  includes: string[];
  support: string;
  highlighted?: boolean;
};

const plans: PartnerPlan[] = [
  {
    name: "Esencial",
    price: "€15",
    size: ["2 usuarios", "5.000 contactos"],
    ai: "300 respuestas del asistente virtual al mes",
    languages: "Entiende y responde solo en español",
    includes: [
      "Conversaciones con clientes 24/7",
      "API oficial y no oficial",
      "Bandeja de entrada",
      "CRM",
    ],
    support: "Centro de ayuda",
  },
  {
    name: "Profesional",
    price: "€35",
    size: ["5 usuarios", "20.000 contactos"],
    ai: "1.500 respuestas del asistente virtual al mes",
    languages: "Entiende y responde en varios idiomas",
    inheritsFrom: "Esencial",
    includes: [
      "Automatizaciones básicas",
      "Ventas",
      "Seguimiento",
      "Agenda con asistente virtual",
    ],
    support: "Soporte por email",
    highlighted: true,
  },
  {
    name: "Completo",
    price: "€70",
    size: ["12 usuarios", "100.000 contactos"],
    ai: "5.000 respuestas del asistente virtual al mes",
    languages: "Entiende y responde en varios idiomas",
    inheritsFrom: "Profesional",
    includes: [
      "Envíos masivos",
      "Rastreo de leads",
      "Anuncios con ROI",
      "Conecta con Google Ads",
      "Conecta con Meta Ads",
    ],
    support: "Soporte prioritario",
  },
];

const howItWorks = [
  "Cada plan define los usuarios y contactos de la bandeja y cuántas respuestas puede dar el asistente virtual al mes",
  "Los planes se suman: Profesional incluye todo lo de Esencial, y Completo incluye todo lo de Profesional",
  "Los envíos masivos no tienen límite mensual y se cobran por uso, a €0,02 por envío",
  "En la API oficial, Meta cobra las conversaciones de WhatsApp directamente en la cuenta del cliente, aparte del precio del plan",
];

export function PartnerPricing() {
  return (
    <section className="w-full bg-gray-950 py-16 md:py-20">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Planes simples para cada tamaño de equipo
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Elige según el tamaño de tu equipo y el volumen de conversaciones
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted;

            return (
              <Reveal
                delay={i * 0.1}
                key={plan.name}
                className={`flex flex-col rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  isHighlighted
                    ? "border-brand-500 bg-brand-500/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-white">
                    {plan.name}
                  </h3>
                  {isHighlighted && (
                    <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/mes por bandeja</span>
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {plan.size.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-medium text-gray-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-sm font-medium text-brand-400">
                  {plan.ai}
                </p>
                <p className="mt-1 text-sm text-gray-400">{plan.languages}</p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  {plan.inheritsFrom && (
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Todo lo de {plan.inheritsFrom}, más
                    </p>
                  )}
                  <ul className="space-y-3">
                    {plan.includes.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-brand-400"
                          strokeWidth={2}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-auto pt-6 text-xs text-gray-500">
                  {plan.support}
                </p>
              </Reveal>
            );
          })}
        </div>

        <Reveal
          delay={0.2}
          className="mx-auto mt-6 max-w-5xl rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-gray-400"
        >
          <p className="font-semibold text-white">Cómo funcionan los planes</p>
          <ul className="mt-3 space-y-2">
            {howItWorks.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
