import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoiPlayground } from "@/components/mockup/RoiPlayground";

// Página de trabalho, só pra revisar o mockup da tela de Resultados em
// desenvolvimento — em produção responde 404 e nunca é indexada.
export const metadata: Metadata = {
  title: "Mockup resultados",
  robots: { index: false, follow: false },
};

export default function MockupRoiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RoiPlayground />;
}
