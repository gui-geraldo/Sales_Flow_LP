import type { Metadata } from "next";
import { PartnerPricing } from "@/components/partner/PartnerPricing";

// Seção de planos para uma integradora específica, privada: só abre por
// esta URL aleatória, que não tem link em lugar nenhum do site. Fora do
// sitemap, bloqueada no robots.txt (pelo prefixo /p/, sem expor a URL) e
// com noindex aqui e no header X-Robots-Tag (next.config.js).
//
// Onde abrir (só comentário, não aparece no site):
//   Localhost:      http://localhost:3000/p/gfv1tl0nzsjw?lang=es&currency=EUR
//   Depois do push: https://sales-flow-lp-2026.vercel.app/p/gfv1tl0nzsjw
export const metadata: Metadata = {
  title: "Planes",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function PartnerPlansPage() {
  return (
    <main className="flex min-h-screen items-center bg-gray-950">
      {/* Exportação em PDF: uma página só, fundo escuro, sem as animações
          de entrada, o banner de cookies e o selo do Next em dev. */}
      <style>{`
        @media print {
          @page { size: 1440px 1000px; margin: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { background: #0A0C0E; }
          [style*="opacity"] { opacity: 1 !important; transform: none !important; }
          .fixed, nextjs-portal { display: none !important; }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          main { min-height: 0 !important; }
        }
      `}</style>
      <PartnerPricing />
    </main>
  );
}
