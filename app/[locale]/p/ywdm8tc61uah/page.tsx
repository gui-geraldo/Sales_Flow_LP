import type { Metadata } from "next";
import { Presenter } from "@/components/apresentacao/Presenter";
import { GeneralSlidesPtBr } from "@/components/apresentacao/GeneralSlidesPtBr";

// Versão pt-BR genérica (qualquer negócio, sem foco em clínica) do material
// de apresentação: mesmos 9 slides da versão de clínicas (/p/fnv7o7559fir),
// planos do Brasil e R$ 0,10 por automação e disparo.
// Privada: só abre por esta URL aleatória, sem link no site, fora do sitemap,
// bloqueada no robots.txt pelo prefixo /p/ e com noindex aqui e no header
// X-Robots-Tag (next.config.js). Sem aviso de cookies (NO_BANNER_PATHS no
// CookieBanner). Cada slide é uma folha A4 deitada; para virar PDF, imprimir
// a página (o @media print abaixo põe um slide por página A4).
//
// Onde abrir (só comentário, não aparece no site):
//   Localhost:      http://localhost:3000/p/ywdm8tc61uah?lang=pt&currency=BRL
//   Depois do push: https://sales-flow-lp-2026.vercel.app/p/ywdm8tc61uah
export const metadata: Metadata = {
  title: "Sales Flow",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function GeneralSlidesPtBrPage() {
  return (
    <main className="deck min-h-screen bg-black">
      {/* Só o fundo da página (.deck) fica escuro na impressão: as telas da
          plataforma dentro dos slides também usam <main> e têm de ficar claras. */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body, .deck { background: #0A0C0E !important; }
          nextjs-portal { display: none !important; }
          .slides { padding: 0 !important; gap: 0 !important; }
          .slide { break-after: page; page-break-after: always; }
          .slide:last-child { break-after: auto; page-break-after: auto; }
        }
      `}</style>
      <Presenter>
        <GeneralSlidesPtBr />
      </Presenter>
    </main>
  );
}
