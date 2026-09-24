// Mesmos traços dos ícones da plataforma (apps/web/src/components/nav/icons.tsx
// e chat/icons.tsx do auto_agendador) — estilo Lucide, traço 1.8px.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function InboxIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  );
}

export function ContactsIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function CrmIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M4 4h16l-6.5 8.5V19l-3 2v-8.5L4 4Z" />
    </svg>
  );
}

export function CampaignsIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4H4a1 1 0 0 0-1 1Z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
      <path d="M20 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function RoiIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" rx="0.5" />
      <rect x="12" y="8" width="3" height="10" rx="0.5" />
      <rect x="17" y="5" width="3" height="13" rx="0.5" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="14" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="8" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} width={15} height={15} className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg {...base} width={14} height={14} className={className}>
      <path d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5Z" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} width={14} height={14} className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function PaperclipIcon({ className }: IconProps) {
  return (
    <svg {...base} width={20} height={20} className={className}>
      <path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
    </svg>
  );
}

export function SmileIcon({ className }: IconProps) {
  return (
    <svg {...base} width={20} height={20} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg {...base} width={20} height={20} className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" className={className}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
