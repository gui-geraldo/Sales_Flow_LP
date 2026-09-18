"use client";

import { trackLeadClick } from "@/lib/track";

export function CtaLink({
  href,
  source,
  className,
  children,
}: {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => trackLeadClick(source)}>
      {children}
    </a>
  );
}
