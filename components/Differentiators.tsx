import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Megaphone, Zap, Sparkles, BadgeCheck, ArrowRight } from "lucide-react";

const items = [
  {
    icon: Megaphone,
    title: "Sabe de qual anúncio veio cada cliente",
    description:
      "A conversa já chega no WhatsApp sabendo de qual anúncio o cliente clicou — sem planilha, sem achismo.",
    illustration: (
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm">
          <Megaphone size={16} className="text-info" strokeWidth={1.8} />
        </div>
        <ArrowRight size={14} className="text-gray-300" />
        <div className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm">
          "Promoção de setembro"
        </div>
      </div>
    ),
    bg: "bg-info-bg",
  },
  {
    icon: Zap,
    title: "Comece hoje, sem esperar aprovação de ninguém",
    description:
      "Use o número de WhatsApp que você já tem, sem fila de aprovação. Quando quiser, migra pra API oficial.",
    illustration: (
      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-warning-text shadow-sm">
        <Zap size={14} className="text-warning" strokeWidth={2} />
        Ativo em minutos, sem fila de espera
      </div>
    ),
    bg: "bg-warning-bg",
  },
  {
    icon: Sparkles,
    title: "A IA já separa quem tá quente de quem tá só perguntando",
    description:
      "Cada caixa de atendimento tem sua própria IA, configurada do seu jeito, e classifica o lead sozinha.",
    illustration: (
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-success-bg px-2.5 py-1 text-[10px] font-semibold text-success-text">
          Quente
        </span>
        <span className="rounded-full bg-warning-bg px-2.5 py-1 text-[10px] font-semibold text-warning-text">
          Morno
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
          Frio
        </span>
      </div>
    ),
    bg: "bg-purple-bg",
  },
  {
    icon: BadgeCheck,
    title: "O número de venda no painel é sempre o número certo",
    description:
      "Toda venda tem um identificador único garantido pelo banco — nunca conta a mesma venda duas vezes.",
    illustration: (
      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-success-text shadow-sm">
        <BadgeCheck size={14} className="text-success" strokeWidth={2} />
        Receita 1:1 com o que entrou de verdade
      </div>
    ),
    bg: "bg-success-bg",
  },
];

export function Differentiators() {
  return (
    <section id="diferenciais" className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
            Por que o Sales Flow
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Tudo que você precisa pra não perder cliente no meio do caminho
          </h2>
          <p className="mt-3 text-gray-600">
            Sem jargão de tecnologia. Só o que muda o seu dia a dia de
            atendimento e venda.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, description, illustration, bg }, i) => (
            <Reveal delay={i * 0.08} key={title}>
              <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div
                  className={`flex h-28 items-center justify-center px-6 transition-transform duration-300 group-hover:scale-[1.03] ${bg}`}
                >
                  {illustration}
                </div>
                <div className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-50 text-gray-500">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
