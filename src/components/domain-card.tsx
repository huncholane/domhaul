"use client";

import type { DomainResult } from "@/lib/types";
import { StatusBadge } from "./status-badge";

const NAMECHEAP_AFF_BASE = "https://namecheap.pxf.io/k4jn2z";

function getRegisterUrl(domain: string): string {
  return `${NAMECHEAP_AFF_BASE}?u=${encodeURIComponent(`https://www.namecheap.com/domains/registration/results/?domain=${domain}`)}`;
}

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
        <div className="flex items-center gap-2">
          <p className="truncate font-mono text-sm text-zinc-100">
            {result.domain}
          </p>
          {result.brandScore != null && (
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                result.brandScore >= 75
                  ? "bg-emerald-500/15 text-emerald-400"
                  : result.brandScore >= 50
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-zinc-700/50 text-zinc-500"
              }`}
              title="Brandability score"
            >
              {result.brandScore}
            </span>
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
