import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { HelpCircle, FileWarning, Users, ArrowRight, CheckCheck } from "lucide-react";

export function Problem() {
  return (
    <section className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-4xl">
            Seu anúncio gera clique, o clique vira conversa no WhatsApp...
            e depois?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Planilha? Caderno? Cada vendedor com seu jeito? É fácil perder o
            fio — e junto com ele, a venda que você já pagou pra atrair.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Reveal delay={0.05} className="rounded-xl border border-gray-200 bg-gray-25 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Sem Sales Flow
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <FileWarning size={16} className="mt-0.5 shrink-0 text-gray-400" />
                Cliente clica no anúncio, ninguém sabe de qual
              </li>
              <li className="flex items-start gap-2">
                <Users size={16} className="mt-0.5 shrink-0 text-gray-400" />
                Cada vendedor atende do seu jeito, sem histórico
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle size={16} className="mt-0.5 shrink-0 text-gray-400" />
                Ninguém sabe quanto o anúncio realmente vendeu
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <ArrowRight size={18} strokeWidth={2.2} />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="rounded-xl border border-brand-200 bg-brand-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Com Sales Flow
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
                Toda conversa chega já com o anúncio de origem
              </li>
              <li className="flex items-start gap-2">
                <CheckCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
                Equipe inteira vê o mesmo histórico, organizado
              </li>
              <li className="flex items-start gap-2">
                <CheckCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
                Painel mostra exatamente o que cada anúncio vendeu
              </li>
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
