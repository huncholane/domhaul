export type AiProvider = "server" | "anthropic" | "openai" | "ollama";

export interface Settings {
  defaultProvider: AiProvider;
  anthropicApiKey: string;
  anthropicModel: string;
  openaiApiKey: string;
  openaiModel: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
  defaultNameCount: number;
  maxRounds: number;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultProvider: "server",
  anthropicApiKey: "",
  anthropicModel: "claude-sonnet-4-6",
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  ollamaBaseUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  defaultNameCount: 15,
  maxRounds: 5,
};

const STORAGE_KEY = "domhaul-settings";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getEffectiveProvider(settings: Settings): AiProvider {
  switch (settings.defaultProvider) {
    case "anthropic":
      return settings.anthropicApiKey.trim() ? "anthropic" : "server";
    case "openai":
      return settings.openaiApiKey.trim() ? "openai" : "server";
    case "ollama":
      return settings.ollamaBaseUrl.trim() ? "ollama" : "server";
    default:
      return "server";
  }
}
