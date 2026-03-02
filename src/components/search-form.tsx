"use client";

import { useState } from "react";
import { TldSelector } from "./tld-selector";
import { NumberStepper } from "./number-stepper";
import { DEFAULT_TLDS, DEFAULT_NAME_COUNT, MAX_AVAILABLE_TARGET, type TLD } from "@/lib/constants";

export interface SearchParams {
  description: string;
  tlds: TLD[];
  nameCount: number;
  availableTarget: number;
}

export function SearchForm({
  onSubmit,
  disabled,
  defaultNameCount,
}: {
  onSubmit: (params: SearchParams) => void;
  disabled: boolean;
  defaultNameCount: number;
}) {
  const [description, setDescription] = useState("");
  const [tlds, setTlds] = useState<TLD[]>([...DEFAULT_TLDS]);
  const [nameCount, setNameCount] = useState(defaultNameCount || DEFAULT_NAME_COUNT);
  const [availableTarget, setAvailableTarget] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || disabled) return;
    onSubmit({ description: description.trim(), tlds, nameCount, availableTarget });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Describe your project
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A minimalist task manager for developers..."
          rows={3}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          TLDs to check
        </label>
        <TldSelector selected={tlds} onChange={setTlds} />
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <label
            htmlFor="name-count"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Names to generate
          </label>
          <NumberStepper
            id="name-count"
            value={nameCount}
            onChange={setNameCount}
            min={1}
            max={50}
            disabled={disabled}
          />
        </div>
        <div>
          <label
            htmlFor="available-target"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Find at least N available
          </label>
          <NumberStepper
            id="available-target"
            value={availableTarget}
            onChange={setAvailableTarget}
            min={0}
            max={MAX_AVAILABLE_TARGET}
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-zinc-500">0 = single round</p>
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || !description.trim()}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        Generate Domain Names
      </button>
    </form>
  );
}
