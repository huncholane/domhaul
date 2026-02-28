"use client";

import { TLDS, type TLD } from "@/lib/constants";

export function TldSelector({
  selected,
  onChange,
}: {
  selected: TLD[];
  onChange: (tlds: TLD[]) => void;
}) {
  function toggle(tld: TLD) {
    if (selected.includes(tld)) {
      if (selected.length > 1) {
        onChange(selected.filter((t) => t !== tld));
      }
    } else {
      onChange([...selected, tld]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TLDS.map((tld) => {
        const active = selected.includes(tld);
        return (
          <button
            key={tld}
            type="button"
            onClick={() => toggle(tld)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30 ring-inset"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {tld}
          </button>
        );
      })}
    </div>
  );
}
