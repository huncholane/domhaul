import { isAvailable, lookup } from "rdapper";
import { CONCURRENCY_LIMIT, RDAP_TIMEOUT_MS, MAX_RETRIES } from "./constants";
import { getCached, getCachedBulk, setCached } from "./cache";
import type { DomainResult } from "./types";

function createSemaphore(limit: number) {
  let running = 0;
  const queue: (() => void)[] = [];

  return {
    async acquire() {
      if (running < limit) {
        running++;
        return;
      }
      await new Promise<void>((resolve) => queue.push(resolve));
      running++;
    },
    release() {
      running--;
      const next = queue.shift();
      if (next) next();
    },
  };
}

async function checkWithRetry(
  domain: string,
  signal?: AbortSignal
): Promise<{ available: boolean; registrar?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (signal?.aborted) throw new Error("Aborted");

    try {
      const available = await isAvailable(domain, {
        timeoutMs: RDAP_TIMEOUT_MS,
        rdapOnly: true,
        signal,
      });

      let registrar: string | undefined;
      if (!available) {
        try {
          const result = await lookup(domain, {
            timeoutMs: RDAP_TIMEOUT_MS,
            rdapOnly: true,
            signal,
          });
          if (result.ok && result.record) {
            registrar = result.record.registrar?.name ?? undefined;
          }
        } catch {
          // Registrar lookup failure is non-fatal
        }
      }

      return { available, registrar };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[domcheck] ${domain} attempt ${attempt}:`, lastError.message, lastError.stack);
      if (signal?.aborted) throw lastError;

      // Last attempt — don't sleep, just let the loop end
      if (attempt === MAX_RETRIES - 1) break;

      // Exponential backoff on all retryable errors
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError ?? new Error("Check failed");
}

export async function checkSingleDomain(
  domain: string,
  signal?: AbortSignal
): Promise<DomainResult> {
  const parts = domain.split(".");
  const tld = "." + parts.slice(1).join(".");
  const name = parts[0];

  // Check cache first
  const cached = await getCached(domain);
  if (cached === "taken") {
    return { domain, name, tld, available: false };
  }

  try {
    const { available, registrar } = await checkWithRetry(domain, signal);
    if (!available) {
      await setCached(domain, "taken");
    }
    return { domain, name, tld, available, registrar };
  } catch (err) {
    return {
      domain,
      name,
      tld,
      available: null,
      error: err instanceof Error ? err.message : "Check failed",
    };
  }
}

export async function checkDomains(
  domains: string[],
  onResult: (result: DomainResult) => void,
  signal?: AbortSignal
): Promise<void> {
  const semaphore = createSemaphore(CONCURRENCY_LIMIT);

  // Bulk cache check
  const cached = await getCachedBulk(domains);

  // Emit cached results immediately
  const uncached: string[] = [];
  for (const domain of domains) {
    if (cached.has(domain)) {
      const parts = domain.split(".");
      onResult({
        domain,
        name: parts[0],
        tld: "." + parts.slice(1).join("."),
        available: false,
      });
    } else {
      uncached.push(domain);
    }
  }

  // Check uncached domains with concurrency control
  const promises = uncached.map(async (domain) => {
    if (signal?.aborted) return;
    await semaphore.acquire();
    try {
      if (signal?.aborted) return;
      const result = await checkSingleDomain(domain, signal);
      onResult(result);
    } finally {
      semaphore.release();
    }
  });

  await Promise.allSettled(promises);
}
