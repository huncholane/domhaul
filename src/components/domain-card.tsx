"use client";

import type { DomainResult } from "@/lib/types";
import { StatusBadge } from "./status-badge";

export function DomainCard({ result }: { result: DomainResult }) {
  const status = result.error
    ? "error"
    : result.available === null
      ? "checking"
      : result.available
        ? "available"
        : "taken";

  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
        status === "available"
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm text-zinc-100">
          {result.domain}
        </p>
        {result.registrar && (
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {result.registrar}
          </p>
        )}
        {result.error && (
          <p className="mt-0.5 truncate text-xs text-red-400/70">
            {result.error}
          </p>
        )}
      </div>
      <div className="ml-3 shrink-0">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
