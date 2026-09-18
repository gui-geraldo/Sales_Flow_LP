declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLeadClick(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", { source });
  window.fbq?.("track", "Lead", { content_name: source });
}
