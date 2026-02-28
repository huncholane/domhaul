export const TLDS = [
  ".com",
  ".io",
  ".dev",
  ".app",
  ".co",
  ".net",
  ".org",
  ".ai",
  ".xyz",
] as const;

export type TLD = (typeof TLDS)[number];

export const DEFAULT_TLDS: TLD[] = [".com"];

export const CONCURRENCY_LIMIT = 5;

export const RDAP_TIMEOUT_MS = 15_000;

export const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week in ms

export const MAX_RETRIES = 4;

export const DEFAULT_NAME_COUNT = 15;

export const DEFAULT_AVAILABLE_TARGET = 0;

export const MAX_AVAILABLE_TARGET = 50;

export const MAX_LOOP_ROUNDS = 5;
