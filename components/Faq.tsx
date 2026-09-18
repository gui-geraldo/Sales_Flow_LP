import { Container } from "./Container";
import { Reveal } from "./Reveal";

const faqs = [
  {
    question: "Preciso da API oficial da Meta pra começar?",
    answer:
      "Não. Você pode começar hoje mesmo com o número que já usa, sem esperar aprovação. Quando fizer sentido pro seu negócio, dá pra migrar para a API oficial do WhatsApp.",
  },
  {
    question: "Meus dados e os dos meus clientes ficam seguros?",
    answer:
      "Sim. Mensagens e dados pessoais são protegidos, e cada conta tem seus dados isolados dos demais clientes do Sales Flow.",
  },
  {
    question: "Dá pra usar no número que já uso hoje?",
    answer:
      "Dá. Você não precisa trocar de número nem migrar sua base de contatos pra começar a usar o Sales Flow.",
  },
  {
    question: "Preciso saber programar ou mexer com tecnologia?",
    answer:
      "Não. O painel foi feito pra dono de negócio e equipe de atendimento configurarem sozinhos, sem programador.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20">
      <Container className="max-w-2xl">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Dúvidas comuns
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-gray-900">
                {faq.question}
                <span className="ml-4 text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
