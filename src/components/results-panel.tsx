"use client";

import { useState } from "react";
import type { DomainResult } from "@/lib/types";
import { DomainCard } from "./domain-card";

export function ResultsPanel({
  candidates,
  results,
  phase,
  round,
  maxRounds,
}: {
  candidates: string[];
  results: DomainResult[];
  phase: "idle" | "generating" | "checking" | "done";
  round: number;
  maxRounds: number;
}) {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const sorted = [...results].sort((a, b) => {
    // Available first, then taken, then errors
    const order = (r: DomainResult) =>
      r.available === true ? 0 : r.available === false ? 1 : 2;
    return order(a) - order(b);
  });

  const filtered = showAvailableOnly
    ? sorted.filter((r) => r.available === true)
    : sorted;

  const availableCount = results.filter((r) => r.available === true).length;

  if (phase === "idle" && results.length === 0 && candidates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Round progress */}
      {maxRounds > 1 && phase !== "idle" && phase !== "done" && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
          <span className="text-xs font-medium text-zinc-400">
            Round {round} of {maxRounds}
          </span>
          {availableCount > 0 && (
            <span className="text-xs text-emerald-400">
              &middot; {availableCount} available so far
            </span>
          )}
        </div>
      )}

      {/* Candidates during generation */}
      {phase === "generating" && candidates.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
            <h3 className="text-sm font-medium text-zinc-400">
              Generating names...
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidates.map((name) => (
              <span
                key={name}
                className="rounded-md bg-zinc-800/70 px-2.5 py-1 font-mono text-sm text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {phase === "checking" && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                  <h3 className="text-sm font-medium text-zinc-400">
                    Checking availability...
                  </h3>
                </div>
              )}
              {phase === "done" && (
                <h3 className="text-sm font-medium text-zinc-400">
                  {availableCount} available out of {results.length} checked
                </h3>
              )}
            </div>
            {results.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  showAvailableOnly
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {showAvailableOnly ? "Show all" : "Available only"}
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {filtered.map((result) => (
              <DomainCard key={result.domain} result={result} />
            ))}
          </div>
          {showAvailableOnly && filtered.length === 0 && (
            <p className="text-center text-sm text-zinc-500">
              No available domains found yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
