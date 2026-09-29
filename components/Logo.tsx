// Logo real do Sales Flow (os dois balões). PNG leve (168px, ~5 KB): nítido
// até em tela retina nos tamanhos usados (28 a 32px). Os SVGs em /public são
// vetorização automática com ~230 KB, pesados demais pra um ícone.
export function Logo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" width={size} height={size} alt="" aria-hidden decoding="async" className="shrink-0" />
  );
}
