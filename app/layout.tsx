import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sales Flow — Do anúncio à venda, numa conversa só de WhatsApp",
  description:
    "CRM, atendimento e IA em um só lugar. Saiba de qual anúncio veio cada cliente e nunca mais perca o fio da conversa no WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
