/**
 * Brandability scoring for domain names.
 * Produces a 0–100 composite score based on length, pronounceability,
 * simplicity, and memorability heuristics.
 */

// --- Pronounceability ---

const VOWELS = new Set("aeiou");
const CONSONANTS = new Set("bcdfghjklmnpqrstvwxyz");

// Common consonant clusters that are easy to pronounce
const EASY_CLUSTERS = new Set([
  "bl", "br", "ch", "cl", "cr", "dr", "fl", "fr", "gl", "gr",
  "pl", "pr", "sc", "sh", "sk", "sl", "sm", "sn", "sp", "st",
  "str", "sw", "th", "tr", "tw", "wh", "wr",
  "nd", "ng", "nk", "nt", "mp", "lt", "lk", "ft", "pt",
]);

/**
 * Score how pronounceable a name is (0–1).
 * Penalises long consonant runs, no vowels, and awkward clusters.
 */
function pronounceabilityScore(name: string): number {
  if (name.length === 0) return 0;

  const lower = name.toLowerCase();
  const vowelCount = [...lower].filter((c) => VOWELS.has(c)).length;
  const vowelRatio = vowelCount / lower.length;

  // No vowels at all is very hard to say
  if (vowelCount === 0) return 0.1;

  // Check for consonant clusters
  let maxConsonantRun = 0;
  let currentRun = 0;
  let badClusters = 0;

  for (const ch of lower) {
    if (CONSONANTS.has(ch)) {
      currentRun++;
      if (currentRun > maxConsonantRun) maxConsonantRun = currentRun;
    } else {
      if (currentRun >= 2) {
        // Check if the cluster is in our "easy" list
        const cluster = lower.slice(
          lower.indexOf(ch) - currentRun,
          lower.indexOf(ch)
        );
        if (!EASY_CLUSTERS.has(cluster)) {
          badClusters++;
        }
      }
      currentRun = 0;
    }
  }

  // Score components
  let score = 1.0;

  // Penalise very low or very high vowel ratios
  if (vowelRatio < 0.2) score *= 0.5;
  else if (vowelRatio < 0.3) score *= 0.75;
  else if (vowelRatio > 0.7) score *= 0.85;

  // Penalise long consonant runs
  if (maxConsonantRun >= 4) score *= 0.4;
  else if (maxConsonantRun >= 3) score *= 0.7;

  // Penalise bad clusters
  score *= Math.max(0.3, 1 - badClusters * 0.15);

  return score;
}

// --- Length score ---

/**
 * Shorter names score higher. Sweet spot is 4–8 characters.
 */
function lengthScore(name: string): number {
  const len = name.length;
  if (len <= 3) return 0.7; // Too short can be confusing
  if (len <= 5) return 1.0;
  if (len <= 8) return 0.9;
  if (len <= 10) return 0.75;
  if (len <= 12) return 0.6;
  if (len <= 15) return 0.4;
  return 0.2;
}

// --- Simplicity (no double letters, no digits, easy chars) ---

function simplicityScore(name: string): number {
  let score = 1.0;

  // Penalise digits
  const digitCount = (name.match(/\d/g) || []).length;
  score *= Math.max(0.4, 1 - digitCount * 0.2);

  // Penalise double letters (e.g., "pressservice" — confusing to type)
  const doubles = name.match(/(.)\1/g);
  if (doubles) {
    score *= Math.max(0.5, 1 - doubles.length * 0.15);
  }

  // Penalise uncommon letters (q, x, z) — harder to type/spell
  const uncommon = (name.match(/[qxz]/gi) || []).length;
  score *= Math.max(0.6, 1 - uncommon * 0.1);

  return score;
}

// --- Memorability (unique structure, not too generic) ---

function memorabilityScore(name: string): number {
  let score = 0.7; // baseline

  // Bonus for compound-word feel (alternating consonant-vowel patterns)
  const cvPattern = [...name.toLowerCase()]
    .map((c) => (VOWELS.has(c) ? "V" : "C"))
    .join("");

  // CVCV patterns are very memorable (e.g., "napa", "uber", "hulu")
  const cvcvRuns = (cvPattern.match(/(?:CV){2,}/g) || []).join("").length;
  const cvcvRatio = cvcvRuns / name.length;
  score += cvcvRatio * 0.3;

  // Bonus for ending in a vowel (sounds more friendly/brandable)
  if (VOWELS.has(name[name.length - 1]?.toLowerCase())) {
    score += 0.05;
  }

  return Math.min(1, score);
}

// --- Composite ---

export interface BrandScoreBreakdown {
  total: number;
  length: number;
  pronounceability: number;
  simplicity: number;
  memorability: number;
}

/**
 * Calculate a brandability score from 0–100 for a bare domain name (no TLD),
 * with per-axis breakdown.
 */
export function brandabilityBreakdown(name: string): BrandScoreBreakdown {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.length === 0)
    return { total: 0, length: 0, pronounceability: 0, simplicity: 0, memorability: 0 };

  const l = lengthScore(clean);
  const p = pronounceabilityScore(clean);
  const s = simplicityScore(clean);
  const m = memorabilityScore(clean);

  const weights = { length: 0.25, pronounceability: 0.30, simplicity: 0.20, memorability: 0.25 };

  const raw =
    l * weights.length +
    p * weights.pronounceability +
    s * weights.simplicity +
    m * weights.memorability;

  return {
    total: Math.round(raw * 100),
    length: Math.round(l * 100),
    pronounceability: Math.round(p * 100),
    simplicity: Math.round(s * 100),
    memorability: Math.round(m * 100),
  };
}

/**
 * Calculate a brandability score from 0–100 for a bare domain name (no TLD).
 */
export function brandabilityScore(name: string): number {
  return brandabilityBreakdown(name).total;
}
