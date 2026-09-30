import { useTranslations } from "next-intl";
import {
  Bot,
  Filter,
  History,
  Inbox,
  ListChecks,
  Megaphone,
  SquareKanban,
  StickyNote,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "../Container";
import { Reveal } from "../Reveal";
import { PAGE_LINKS } from "./links";

// Ícone escolhido pelo texto (campo "icon" de cada item no i18n).
const ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  filter: Filter,
  history: History,
  inbox: Inbox,
  kanban: SquareKanban,
  tasks: ListChecks,
  ads: Megaphone,
  note: StickyNote,
  owner: UserCheck,
  team: Users,
};

type Item = { icon: string; title: string; description: string };

// Seção "Qué hace" das páginas de busca (âncora #diferenciais do menu).
export function FeatureGrid({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const items = t.raw("items") as Item[];

  return (
    <section id="diferenciais" className="border-b border-white/10 bg-gray-950 py-10 md:py-12">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white">{t("title")}</h2>
          <p className="mt-3 text-gray-400">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Inbox;
            return (
              <Reveal
                delay={(i % 3) * 0.07}
                key={item.title}
                className="rounded-xl border border-white/10 bg-gray-900 p-6 transition-colors duration-200 ease-out hover:border-white/20"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500/15 text-brand-400">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {t.rich(`items.${i}.description`, PAGE_LINKS)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
