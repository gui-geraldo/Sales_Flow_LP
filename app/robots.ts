import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Fora do índice: a API do formulário e as páginas de teste/mockup, que
// duplicariam ou confundiriam o conteúdo da home.
const PRIVATE = ["/api/", "/v1", "/vnew", "/mockup_plataforma", "/mockup_roi"];

// Google, Bing e a busca do ChatGPT (OAI-SearchBot) ganham grupo explícito.
// Um robô com grupo próprio ignora o grupo "*", então as mesmas proibições
// precisam se repetir aqui. Os demais robôs (incluindo outros de IA) seguem "*".
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot"], allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
