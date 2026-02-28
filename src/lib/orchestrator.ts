import type { StreamEvent } from "./types";
import type { AiProvider, Settings } from "./settings";
import {
  generateNamesAnthropic,
  generateNamesOpenAI,
  generateNamesOllama,
} from "./client-generators";

export interface OrchestrateParams {
  description: string;
  tlds: string[];
  nameCount: number;
  availableTarget: number;
  provider: AiProvider;
  settings: Settings;
  signal: AbortSignal;
  onEvent: (event: StreamEvent) => void;
}

const CHECK_BATCH_SIZE = 100;

export async function orchestrate(params: OrchestrateParams): Promise<void> {
  const {
    description,
    tlds,
    nameCount,
    availableTarget,
    provider,
    settings,
    signal,
    onEvent,
  } = params;

  const maxRounds =
    availableTarget > 0 ? settings.maxRounds : 1;
  const allSeenNames = new Set<string>();
  let totalAvailable = 0;

  for (let round = 1; round <= maxRounds; round++) {
    if (signal.aborted) break;
    if (round > 1 && totalAvailable >= availableTarget) break;

    if (maxRounds > 1) {
      onEvent({ type: "round", round, maxRounds });
    }

    // Phase 1: Generate names
    onEvent({ type: "phase", phase: "generating" });

    const roundNames: string[] = [];

    if (provider === "server") {
      // Use /api/generate SSE endpoint
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, count: nameCount }),
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        onEvent({ type: "error", message: text || `HTTP ${res.status}` });
        onEvent({ type: "done" });
        return;
      }

      await consumeSSE(res, (event) => {
        if (event.type === "candidate") {
          if (!allSeenNames.has(event.name)) {
            allSeenNames.add(event.name);
            roundNames.push(event.name);
            onEvent(event);
          }
        } else if (event.type === "error") {
          onEvent(event);
        }
        // Ignore phase/done from server — we manage those ourselves
      });
    } else {
      // Client-side generation
      const generator = getClientGenerator(
        provider,
        settings,
        description,
        nameCount,
        signal
      );

      for await (const name of generator) {
        if (signal.aborted) break;
        if (!allSeenNames.has(name)) {
          allSeenNames.add(name);
          roundNames.push(name);
          onEvent({ type: "candidate", name });
        }
      }
    }

    if (roundNames.length === 0) {
      if (round === 1) {
        onEvent({ type: "error", message: "No valid names generated" });
      }
      break;
    }

    // Phase 2: Check availability
    onEvent({ type: "phase", phase: "checking" });

    const domains = roundNames.flatMap((name) =>
      tlds.map((tld) => `${name}${tld}`)
    );

    // Send in batches
    for (let i = 0; i < domains.length; i += CHECK_BATCH_SIZE) {
      if (signal.aborted) break;
      const batch = domains.slice(i, i + CHECK_BATCH_SIZE);

      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: batch }),
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        onEvent({ type: "error", message: text || `HTTP ${res.status}` });
        continue;
      }

      await consumeSSE(res, (event) => {
        if (event.type === "result") {
          onEvent(event);
          if (event.result.available === true) {
            totalAvailable++;
          }
        } else if (event.type === "error") {
          onEvent(event);
        }
      });

      if (availableTarget > 0 && totalAvailable >= availableTarget) break;
    }

    if (availableTarget > 0 && totalAvailable >= availableTarget) break;
  }

  onEvent({ type: "done" });
}

function getClientGenerator(
  provider: AiProvider,
  settings: Settings,
  description: string,
  count: number,
  signal: AbortSignal
): AsyncGenerator<string> {
  switch (provider) {
    case "anthropic":
      return generateNamesAnthropic(
        settings.anthropicApiKey,
        settings.anthropicModel,
        description,
        count,
        signal
      );
    case "openai":
      return generateNamesOpenAI(
        settings.openaiApiKey,
        settings.openaiModel,
        description,
        count,
        signal
      );
    case "ollama":
      return generateNamesOllama(
        settings.ollamaBaseUrl,
        settings.ollamaModel,
        description,
        count,
        signal
      );
    default:
      throw new Error(`Invalid client provider: ${provider}`);
  }
}

async function consumeSSE(
  response: Response,
  onEvent: (event: StreamEvent) => void
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const event: StreamEvent = JSON.parse(line.slice(6));
            onEvent(event);
          } catch {
            // skip malformed
          }
        }
      }
    }

    // Remaining buffer
    if (buffer.startsWith("data: ")) {
      try {
        const event: StreamEvent = JSON.parse(buffer.slice(6));
        onEvent(event);
      } catch {
        // skip
      }
    }
  } finally {
    reader.releaseLock();
  }
}
