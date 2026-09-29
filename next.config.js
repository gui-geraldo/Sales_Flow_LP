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
};

module.exports = withNextIntl(nextConfig);
