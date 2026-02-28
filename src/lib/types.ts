export interface DomainResult {
  domain: string;
  name: string;
  tld: string;
  available: boolean | null; // null = still checking
  registrar?: string;
  error?: string;
}

export type StreamEvent =
  | { type: "phase"; phase: "generating" | "checking" }
  | { type: "candidate"; name: string }
  | { type: "result"; result: DomainResult }
  | { type: "round"; round: number; maxRounds: number }
  | { type: "error"; message: string }
  | { type: "done" };

export interface GenerateRequest {
  description: string;
  count: number;
}

export interface CheckRequest {
  domains: string[];
}
