const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // O Next 15 manda título, descrição, Open Graph e canonical no <body>
  // ("streaming metadata") pra quem não está na lista de robôs dele, e o
  // Googlebot não está. O Google ignora canonical fora do <head> e os
  // robôs de IA não executam JS. Com /.*/ todo mundo recebe os metadados
  // no <head>, já no HTML do servidor.
  htmlLimitedBots: /.*/,
  // Páginas privadas em /p/: noindex também no header, que vale mesmo para
  // quem não lê o HTML.
  async headers() {
    return [
      {
        source: "/p/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
