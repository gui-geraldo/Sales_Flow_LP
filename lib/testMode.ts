// Modo teste (15/11/2026): ?teste=1 liga e fica gravado no aparelho até ?teste=0.
// Liga também "umami.disabled" (chave oficial do Umami): o aparelho some do Umami.
export const TEST_KEY = "sf_teste";

export function syncTestMode() {
  if (typeof window === "undefined") return;
  const flag = new URLSearchParams(window.location.search).get("teste");
  try {
    if (flag === "1") {
      localStorage.setItem(TEST_KEY, "1");
      localStorage.setItem("umami.disabled", "1");
    } else if (flag === "0") {
      localStorage.removeItem(TEST_KEY);
      localStorage.removeItem("umami.disabled");
    }
  } catch {}
}

export function isTestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(TEST_KEY) === "1";
  } catch {
    return false;
  }
}
