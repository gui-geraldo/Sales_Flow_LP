import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MockupPlayground } from "@/components/mockup/MockupPlayground";

// Página de trabalho, só pra revisar o mockup animado da plataforma em
// desenvolvimento — em produção responde 404 e nunca é indexada.
export const metadata: Metadata = {
  title: "Mockup plataforma",
  robots: { index: false, follow: false },
};

export default function MockupPlataformaPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MockupPlayground />;
}
