import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Buscadores e robôs de IA liberados (incluindo os de busca do ChatGPT,
// Claude e Perplexity). Fora do índice: a API do formulário e as páginas
// de teste/mockup, que duplicariam ou confundiriam o conteúdo da home.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/v1", "/vnew", "/mockup_plataforma", "/mockup_roi"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
