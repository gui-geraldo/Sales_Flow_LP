// Logo real do Sales Flow: os dois balões dentro do círculo branco (a versão
// sem círculo some no fundo escuro). PNG leve (168px, ~4 KB), nítido até em
// tela retina nos tamanhos usados (28 a 32px); o logo-badge.svg é vetorização
// automática com ~230 KB, pesado demais pra um ícone.
export function Logo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-badge.png" width={size} height={size} alt="" aria-hidden decoding="async" className="shrink-0" />
  );
}
