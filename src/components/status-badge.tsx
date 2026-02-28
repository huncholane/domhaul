"use client";

export function StatusBadge({
  status,
}: {
  status: "available" | "taken" | "checking" | "error";
}) {
  switch (status) {
    case "available":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20 ring-inset">
          Available
        </span>
      );
    case "taken":
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-500/20 ring-inset">
          Taken
        </span>
      );
    case "checking":
      return (
        <span className="inline-flex animate-pulse items-center rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-400/20 ring-inset">
          Checking
        </span>
      );
    case "error":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20 ring-inset">
          Error
        </span>
      );
  }
}
