import { createClient, type Client } from "@libsql/client";
import { CACHE_TTL } from "./constants";

let client: Client | null = null;
let initialized = false;

function getClient(): Client | null {
  if (client) return client;
  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;
  client = createClient({ url, authToken: authToken || undefined });
  return client;
}

async function ensureTable(db: Client) {
  if (initialized) return;
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS domain_cache (
        domain TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        checked_at INTEGER NOT NULL
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS shared_results (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        results TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      args: [],
    },
  ]);
  initialized = true;
}

export async function getCached(
  domain: string
): Promise<"taken" | null> {
  const db = getClient();
  if (!db) return null;
  try {
    await ensureTable(db);
    const result = await db.execute({
      sql: "SELECT status, checked_at FROM domain_cache WHERE domain = ?",
      args: [domain],
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    const checkedAt = row.checked_at as number;
    if (Date.now() - checkedAt > CACHE_TTL) return null;
    return row.status as "taken";
  } catch {
    return null;
  }
}

export async function setCached(
  domain: string,
  status: "taken"
): Promise<void> {
  const db = getClient();
  if (!db) return;
  try {
    await ensureTable(db);
    await db.execute({
      sql: `INSERT OR REPLACE INTO domain_cache (domain, status, checked_at)
            VALUES (?, ?, ?)`,
      args: [domain, status, Date.now()],
    });
  } catch {
    // Cache write failure is non-fatal
  }
}

export async function getCachedBulk(
  domains: string[]
): Promise<Map<string, "taken">> {
  const result = new Map<string, "taken">();
  const db = getClient();
  if (!db || domains.length === 0) return result;
  try {
    await ensureTable(db);
    // Batch in groups of 50 to avoid overly large queries
    const batchSize = 50;
    for (let i = 0; i < domains.length; i += batchSize) {
      const batch = domains.slice(i, i + batchSize);
      const placeholders = batch.map(() => "?").join(",");
      const now = Date.now();
      const res = await db.execute({
        sql: `SELECT domain, status FROM domain_cache
              WHERE domain IN (${placeholders})
              AND checked_at > ?`,
        args: [...batch, now - CACHE_TTL],
      });
      for (const row of res.rows) {
        result.set(row.domain as string, row.status as "taken");
      }
    }
  } catch {
    // Cache read failure is non-fatal
  }
  return result;
}

// --- Shared results ---

export interface SharedResult {
  id: string;
  prompt: string;
  results: { domain: string; brandScore?: number }[];
  createdAt: number;
}

export async function saveShare(
  id: string,
  prompt: string,
  results: { domain: string; brandScore?: number }[]
): Promise<boolean> {
  const db = getClient();
  if (!db) return false;
  try {
    await ensureTable(db);
    await db.execute({
      sql: `INSERT INTO shared_results (id, prompt, results, created_at) VALUES (?, ?, ?, ?)`,
      args: [id, prompt, JSON.stringify(results), Date.now()],
    });
    return true;
  } catch {
    return false;
  }
}

export async function getShare(id: string): Promise<SharedResult | null> {
  const db = getClient();
  if (!db) return null;
  try {
    await ensureTable(db);
    const res = await db.execute({
      sql: "SELECT id, prompt, results, created_at FROM shared_results WHERE id = ?",
      args: [id],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id as string,
      prompt: row.prompt as string,
      results: JSON.parse(row.results as string),
      createdAt: row.created_at as number,
    };
  } catch {
    return null;
  }
}
