// Logo real do Sales Flow: os dois balões dentro do círculo branco (a versão
// sem círculo some no fundo escuro). PNG leve (168px, ~4 KB), nítido até em
// tela retina nos tamanhos usados (28 a 32px); o logo-badge.svg é vetorização
// automática com ~230 KB, pesado demais pra um ícone.
// Nome da marca: "Sales Flow by Talker Flow" (pra não confundir com o
// salesflow.io). O "by Talker Flow" some em telas bem estreitas no cabeçalho.
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="text-[15px] font-semibold tracking-tight text-white">
      Sales Flow{" "}
      <span className={`font-normal text-gray-500 ${compact ? "hidden sm:inline" : ""}`}>by Talker Flow</span>
    </span>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-badge.png" width={size} height={size} alt="" aria-hidden decoding="async" className="shrink-0" />
  );
}
