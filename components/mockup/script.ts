// Roteiro do mockup animado da bandeja (/inbox da plataforma): estrutura e
// ritmo. Todo o texto (diálogos, nomes, etiquetas, rótulos da interface)
// fica no i18n, namespace `mockup` de messages/{es,pt,en}.json — aqui só
// ids, cores e tempos.
//
// Só mostra o que a plataforma faz de verdade: origem do anúncio,
// classificação automática de temperatura pela IA (tool qualify_lead),
// captura do nome com a sugestão "A IA captou algo diferente → Usar este"
// (extract_contact_fields + fillOrSuggest), IA que entende áudio
// (transcrição) e resposta automática. A "consulta" é a IA combinando dia e
// hora na conversa — não há integração com agenda nem lembrete automático,
// então nada disso é prometido.

export type Temperature = "cold" | "warm" | "hot" | "problem" | "paid";

export type TagKey = "urgency" | "orthodontics" | "implants" | "whitening" | "cleaning";

export type MockTag = { key: TagKey; color: string };

/** Linha da fila — nome e prévia vêm de `mockup.queue.<id>`. */
export type QueueRow = {
  id: string;
  /** "yesterday" vira o rótulo traduzido; o resto é hora literal */
  time: string;
  previewType?: "audio";
  previewOut?: boolean;
  temperature: Temperature | null;
  tag?: MockTag;
  unread?: boolean;
};

/** Texto em `mockup.messages.<id>`; notas da IA em `mockup.notes.<id>.{title,body}`. */
export type MockMessage =
  | { id: string; kind: "text"; dir: "in" | "out"; time: string }
  | { id: string; kind: "audio"; dir: "in" | "out"; duration: string; time: string }
  /** balãozinho da IA entre as mensagens (anotação do mockup, não é mensagem real) */
  | { id: string; kind: "ai-note"; icon: "origin" | "audio" | "check" };

export type Step =
  | { at: number; type: "message"; message: MockMessage }
  | { at: number; type: "typing"; on: boolean }
  | { at: number; type: "temperature"; value: Temperature }
  | { at: number; type: "tag"; tag: MockTag }
  /** balão apontando pra classificação na lista */
  | { at: number; type: "identified"; on: boolean }
  /** cartão real "A IA captou algo diferente" — aparece, clica em "Usar este", some */
  | { at: number; type: "nameSuggestion"; state: "shown" | "pressed" | null }
  /** troca o nome do contato: do pushName do WhatsApp pro nome captado pela IA */
  | { at: number; type: "nameCaptured" }
  /** esconde a lista de conversas (desliza pra esquerda) e a conversa ocupa a tela toda */
  | { at: number; type: "hideList" };

export const TAG_COLORS: Record<TagKey, string> = {
  urgency: "#ef4444",
  orthodontics: "#8b5cf6",
  implants: "#3b82f6",
  whitening: "#eab308",
  cleaning: "#06b6d4",
};

/** Resto da fila — conversas que já existem, com temperaturas e etiquetas variadas. */
export const QUEUE: QueueRow[] = [
  { id: "q1", time: "10:38", temperature: "hot", tag: { key: "urgency", color: TAG_COLORS.urgency }, unread: true },
  { id: "q2", time: "10:21", temperature: "warm", tag: { key: "orthodontics", color: TAG_COLORS.orthodontics } },
  { id: "q3", time: "09:57", temperature: "paid", tag: { key: "implants", color: TAG_COLORS.implants } },
  { id: "q4", time: "09:40", temperature: "problem" },
  { id: "q5", time: "09:12", temperature: "cold", tag: { key: "whitening", color: TAG_COLORS.whitening } },
  { id: "q6", time: "yesterday", temperature: "warm", previewOut: true },
];

/**
 * Linha do tempo da conversa principal (ms desde o início do ciclo).
 * Tamanho calibrado pra conversa inteira caber na janela do chat, da
 * primeira à última mensagem, sem nada sumir por cima — mensagens curtas
 * (a maioria numa linha) e as notas da IA sempre numa linha só.
 */
export const STEPS: Step[] = [
  { at: 500, type: "message", message: { id: "m1", kind: "text", dir: "in", time: "10:42" } },
  { at: 800, type: "message", message: { id: "origin", kind: "ai-note", icon: "origin" } },
  { at: 1000, type: "typing", on: true },
  { at: 1800, type: "typing", on: false },
  { at: 1800, type: "message", message: { id: "m2", kind: "text", dir: "out", time: "10:42" } },
  { at: 2100, type: "temperature", value: "hot" },
  { at: 2100, type: "tag", tag: { key: "cleaning", color: TAG_COLORS.cleaning } },
  { at: 2100, type: "identified", on: true },
  { at: 3600, type: "identified", on: false },
  // a classificação aparece na lista; depois dela a lista sai de cena
  { at: 3800, type: "hideList" },
  { at: 4200, type: "message", message: { id: "m3", kind: "text", dir: "in", time: "10:42" } },
  { at: 4800, type: "nameSuggestion", state: "shown" },
  { at: 6000, type: "nameSuggestion", state: "pressed" },
  { at: 6300, type: "nameSuggestion", state: null },
  { at: 6300, type: "nameCaptured" },
  { at: 6600, type: "typing", on: true },
  { at: 7500, type: "typing", on: false },
  { at: 7500, type: "message", message: { id: "m4", kind: "text", dir: "out", time: "10:43" } },
  { at: 8900, type: "message", message: { id: "m5", kind: "audio", dir: "in", duration: "0:06", time: "10:43" } },
  { at: 9600, type: "message", message: { id: "audio", kind: "ai-note", icon: "audio" } },
  { at: 10100, type: "typing", on: true },
  { at: 11000, type: "typing", on: false },
  { at: 11000, type: "message", message: { id: "m6", kind: "text", dir: "out", time: "10:44" } },
  { at: 11500, type: "message", message: { id: "booked", kind: "ai-note", icon: "check" } },
  { at: 12500, type: "message", message: { id: "m7", kind: "text", dir: "in", time: "10:44" } },
];

/** Tempo total do ciclo antes de recomeçar (ms). */
export const CYCLE_MS = 16500;
