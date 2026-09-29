"use client";

import { trackLeadClick } from "@/lib/track";
import { useLead } from "@/components/lead/LeadProvider";
import type { LeadIntent } from "@/lib/lead";

export function CtaLink({
  href,
  source,
  intent,
  className,
  children,
}: {
  href: string;
  source: string;
  // Fora do Brasil, com intent definido, o botão abre o formulário curto
  // em vez de seguir o href (que continua valendo pro Brasil).
  intent?: LeadIntent;
  className?: string;
  children: React.ReactNode;
}) {
  const lead = useLead();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (lead.enabled && intent) {
          e.preventDefault();
          lead.open(intent, source);
          return;
        }
        trackLeadClick(source);
      }}
    >
      {children}
    </a>
  );
}
