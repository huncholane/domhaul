"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadHistory,
  deleteEntry,
  clearHistory,
  setRerunEntry,
  type SearchEntry,
} from "@/lib/search-history";
import { DomainCard } from "@/components/domain-card";
import type { DomainResult } from "@/lib/types";

function HistoryAccordion({
  entry,
  onRerun,
  onDelete,
}: {
  entry: SearchEntry;
  onRerun: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const results = entry.results ?? [];
  const sorted = [...results].sort((a, b) => {
    const order = (r: DomainResult) =>
      r.available === true ? 0 : r.available === false ? 1 : 2;
    return order(a) - order(b);
  });
  const filtered = showAvailableOnly
    ? sorted.filter((r) => r.available === true)
    : sorted;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      {/* Closed header — always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`shrink-0 text-zinc-500 transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-zinc-200">
            {entry.description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="text-emerald-400">
              {entry.availableFound} available
            </span>
            <span>{entry.totalChecked} checked</span>
            {(entry.roundsUsed ?? 1) > 1 && (
              <span>{entry.roundsUsed} rounds</span>
            )}
            <span>{entry.tlds.join(", ")}</span>
            <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onRerun}
            className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          >
            Re-run
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label="Delete search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 3.5l7 7M10.5 3.5l-7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded results */}
      {open && (
        <div className="border-t border-zinc-800 px-4 py-3">
          {results.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No results saved for this search.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">
                  {entry.availableFound} available out of {entry.totalChecked} checked
                </p>
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
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {filtered.map((result) => (
                  <DomainCard key={result.domain} result={result} />
                ))}
              </div>
              {showAvailableOnly && filtered.length === 0 && (
                <p className="text-center text-sm text-zinc-500">
                  No available domains in this search.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleDelete(id: string) {
    deleteEntry(id);
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  function handleRerun(entry: SearchEntry) {
    setRerunEntry(entry);
    router.push("/");
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          &larr; Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
          Search History
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your past domain searches, stored locally in your browser.
        </p>
      </header>

      {history.length === 0 ? (
        <p className="text-sm text-zinc-500">No searches yet.</p>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-zinc-500 transition-colors hover:text-red-400"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {history.map((entry) => (
              <HistoryAccordion
                key={entry.id}
                entry={entry}
                onRerun={() => handleRerun(entry)}
                onDelete={() => handleDelete(entry.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
