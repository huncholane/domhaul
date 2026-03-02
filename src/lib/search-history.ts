import type { TLD } from "./constants";
import type { DomainResult } from "./types";

export interface SearchEntry {
  id: string;
  description: string;
  tlds: TLD[];
  nameCount: number;
  availableTarget: number;
  timestamp: number;
  availableFound: number;
  totalChecked: number;
  roundsUsed: number;
  results: DomainResult[];
}

const STORAGE_KEY = "domhaul-search-history";
const MAX_ENTRIES = 20;

export function loadHistory(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SearchEntry[];
  } catch {
    return [];
  }
}

export function saveSearch(entry: Omit<SearchEntry, "id" | "timestamp">): SearchEntry {
  const full: SearchEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const history = loadHistory();
  history.unshift(full);
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return full;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteEntry(id: string): void {
  const history = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

const RERUN_KEY = "domhaul-rerun";

export function setRerunEntry(entry: SearchEntry): void {
  sessionStorage.setItem(RERUN_KEY, JSON.stringify(entry));
}

export function consumeRerunEntry(): SearchEntry | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RERUN_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(RERUN_KEY);
  try {
    return JSON.parse(raw) as SearchEntry;
  } catch {
    return null;
  }
}
