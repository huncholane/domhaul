"use client";

import { useState } from "react";
import type { StreamEvent } from "@/lib/types";

export function ManualCheck({
  onEvent,
  onStart,
  disabled,
}: {
  onEvent: (event: StreamEvent) => void;
  onStart: () => AbortController;
  disabled: boolean;
}) {
  const [input, setInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    const controller = onStart();
    const domains = input
      .split(/[,\s\n]+/)
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    if (domains.length === 0) return;

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        onEvent({ type: "error", message: text || `HTTP ${res.status}` });
        onEvent({ type: "done" });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        onEvent({ type: "error", message: "No response stream" });
        onEvent({ type: "done" });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6));
              onEvent(event);
            } catch {
              // Skip malformed events
            }
          }
        }
      }

      if (buffer.startsWith("data: ")) {
        try {
          const event: StreamEvent = JSON.parse(buffer.slice(6));
          onEvent(event);
        } catch {
          // Skip
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        onEvent({ type: "done" });
        return;
      }
      onEvent({
        type: "error",
        message: err instanceof Error ? err.message : "Request failed",
      });
      onEvent({ type: "done" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="domains"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Domains to check
        </label>
        <textarea
          id="domains"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="example.com, myapp.io, coolname.dev"
          rows={3}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Separate domains with commas, spaces, or newlines
        </p>
      </div>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        Check Availability
      </button>
    </form>
  );
}
