import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Lock, Building2, UserX } from "lucide-react";

const items = [
  {
    icon: Lock,
    title: "Dado cifrado, sempre",
    description:
      "Mensagens e dados pessoais dos seus clientes ficam cifrados no banco, não em texto aberto.",
  },
  {
    icon: Building2,
    title: "Isolamento total por conta",
    description:
      "Seus dados nunca se misturam com os de outro negócio que usa o Sales Flow — cada conta é um espaço isolado.",
  },
  {
    icon: UserX,
    title: "Opt-out respeitado de verdade",
    description:
      "Quem pede pra sair ou é bloqueado nunca mais recebe mensagem, mesmo em disparos em massa.",
  },
];

export function Security() {
  return (
    <section id="seguranca" className="relative overflow-hidden bg-gray-900 py-20">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[380px] w-[380px] rounded-full bg-brand-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-[320px] w-[320px] rounded-full bg-info/10 blur-[110px]" />

      <Container className="relative grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-400">
            Dado sensível, tratado a sério
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Você está lidando com conversa e dado de cliente real. Levamos
            isso a sério.
          </h2>
          <p className="mt-3 text-gray-400">
            Não é só sobre vender mais — é sobre não colocar em risco a
            confiança que seu cliente depositou em você.
          </p>
        </Reveal>

        <div className="space-y-4">
          {items.map(({ icon: Icon, title, description }, i) => (
            <Reveal delay={i * 0.1} key={title}>
              <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-500/15 text-brand-400">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
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
