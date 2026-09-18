import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { MessageCircle, Megaphone, Search } from "lucide-react";

const clients = ["VetApp", "HOC", "CETAO DON"];
const integrations = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Megaphone, label: "Meta Ads" },
  { icon: Search, label: "Google Ads" },
];

export function TrustBar() {
  const t = useTranslations("trustBar");

  return (
    <section className="border-y border-gray-100 bg-gray-25 py-10">
      <Container className="grid gap-8 sm:grid-cols-2 sm:divide-x sm:divide-gray-200">
        <div className="text-center sm:pr-8">
          <p className="text-sm font-medium text-gray-500">
            {t("clientsLabel")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {clients.map((name) => (
              <span
                key={name}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center sm:pl-8">
          <p className="text-sm font-medium text-gray-500">
            {t("integrationsLabel")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {integrations.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              >
                <Icon size={15} strokeWidth={1.8} className="text-gray-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
