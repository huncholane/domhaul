"use client";

import { useState } from "react";
import type { DomainResult } from "@/lib/types";
import { StatusBadge } from "./status-badge";

function getRegisterUrl(domain: string): string {
  return `/api/register?domain=${encodeURIComponent(domain)}`;
}

export function DomainCard({ result }: { result: DomainResult }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

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
        <div className="flex items-center gap-2">
          <p className="truncate font-mono text-sm text-zinc-100">
            {result.domain}
          </p>
          {result.brandScore != null && (
            <div className="relative">
              <button
                type="button"
                className={`shrink-0 cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                  result.brandScore >= 75
                    ? "bg-emerald-500/15 text-emerald-400"
                    : result.brandScore >= 50
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-zinc-700/50 text-zinc-500"
                }`}
                onMouseEnter={() => setShowBreakdown(true)}
                onMouseLeave={() => setShowBreakdown(false)}
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                {result.brandScore}
              </button>
              {showBreakdown && result.brandBreakdown && (
                <div className="absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2">
                  <div className="w-44 rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 shadow-xl">
                    <p className="mb-1.5 text-[10px] font-semibold text-zinc-300">Brandability</p>
                    <div className="space-y-1.5">
                      {([
                        ["Length", result.brandBreakdown.length],
                        ["Pronounce", result.brandBreakdown.pronounceability],
                        ["Simplicity", result.brandBreakdown.simplicity],
                        ["Memorable", result.brandBreakdown.memorability],
                      ] as const).map(([label, value]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400">{label}</span>
                            <span className="font-mono text-zinc-300">{value}</span>
                          </div>
                          <div className="mt-0.5 h-1 w-full rounded-full bg-zinc-700">
                            <div
                              className={`h-1 rounded-full ${
                                value >= 75
                                  ? "bg-emerald-500"
                                  : value >= 50
                                    ? "bg-amber-500"
                                    : "bg-zinc-500"
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
      <div className="ml-3 flex shrink-0 items-center gap-2">
        {status === "available" && (
          <a
            href={getRegisterUrl(result.domain)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Register
          </a>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
