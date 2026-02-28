"use client";

import { useReducer, useRef, useCallback, useEffect, useState } from "react";
import { SearchForm, type SearchParams } from "@/components/search-form";
import { ManualCheck } from "@/components/manual-check";
import { ResultsPanel } from "@/components/results-panel";
import type { DomainResult, StreamEvent } from "@/lib/types";
import { loadSettings, getEffectiveProvider, type Settings, type AiProvider } from "@/lib/settings";
import { orchestrate } from "@/lib/orchestrator";

type Mode = "generate" | "check";
type Phase = "idle" | "generating" | "checking" | "done";

interface State {
  mode: Mode;
  phase: Phase;
  candidates: string[];
  results: DomainResult[];
  error: string | null;
  round: number;
  maxRounds: number;
  availableCount: number;
}

type Action =
  | { type: "SET_MODE"; mode: Mode }
  | { type: "START" }
  | { type: "PHASE"; phase: "generating" | "checking" }
  | { type: "CANDIDATE"; name: string }
  | { type: "RESULT"; result: DomainResult }
  | { type: "ROUND"; round: number; maxRounds: number }
  | { type: "ERROR"; message: string }
  | { type: "DONE" }
  | { type: "CANCEL" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "START":
      return {
        ...state,
        phase: "idle",
        candidates: [],
        results: [],
        error: null,
        round: 0,
        maxRounds: 0,
        availableCount: 0,
      };
    case "PHASE":
      return { ...state, phase: action.phase };
    case "CANDIDATE":
      return { ...state, candidates: [...state.candidates, action.name] };
    case "RESULT": {
      const newAvailable =
        action.result.available === true
          ? state.availableCount + 1
          : state.availableCount;
      return {
        ...state,
        results: [...state.results, action.result],
        availableCount: newAvailable,
      };
    }
    case "ROUND":
      return { ...state, round: action.round, maxRounds: action.maxRounds };
    case "ERROR":
      return { ...state, error: action.message };
    case "DONE":
      return { ...state, phase: "done" };
    case "CANCEL":
      return { ...state, phase: "done" };
    default:
      return state;
  }
}

const initialState: State = {
  mode: "generate",
  phase: "idle",
  candidates: [],
  results: [],
  error: null,
  round: 0,
  maxRounds: 0,
  availableCount: 0,
};

const PROVIDER_LABELS: Record<AiProvider, string> = {
  server: "Server",
  anthropic: "Anthropic",
  openai: "OpenAI",
  ollama: "Ollama",
};

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [provider, setProvider] = useState<AiProvider>("server");

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setProvider(getEffectiveProvider(s));
  }, []);

  const isActive = state.phase === "generating" || state.phase === "checking";

  const handleEvent = useCallback((event: StreamEvent) => {
    switch (event.type) {
      case "phase":
        dispatch({ type: "PHASE", phase: event.phase });
        break;
      case "candidate":
        dispatch({ type: "CANDIDATE", name: event.name });
        break;
      case "result":
        dispatch({ type: "RESULT", result: event.result });
        break;
      case "round":
        dispatch({ type: "ROUND", round: event.round, maxRounds: event.maxRounds });
        break;
      case "error":
        dispatch({ type: "ERROR", message: event.message });
        break;
      case "done":
        dispatch({ type: "DONE" });
        break;
    }
  }, []);

  const handleGenerate = useCallback(
    async (params: SearchParams) => {
      if (!settings) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      dispatch({ type: "START" });

      try {
        await orchestrate({
          description: params.description,
          tlds: params.tlds,
          nameCount: params.nameCount,
          availableTarget: params.availableTarget,
          provider,
          settings,
          signal: controller.signal,
          onEvent: handleEvent,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          dispatch({ type: "DONE" });
          return;
        }
        dispatch({
          type: "ERROR",
          message: err instanceof Error ? err.message : "Request failed",
        });
        dispatch({ type: "DONE" });
      }
    },
    [settings, provider, handleEvent]
  );

  // ManualCheck still uses its own onEvent/onStart pattern
  const handleManualStart = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    dispatch({ type: "START" });
    return controller;
  }, []);

  function handleCancel() {
    abortRef.current?.abort();
    dispatch({ type: "CANCEL" });
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={36} height={36} className="rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            domhaul
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Find available domain names with AI or check your own
        </p>
      </header>

      {/* Mode tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-zinc-900 p-1">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_MODE", mode: "generate" })}
          disabled={isActive}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            state.mode === "generate"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-300"
          } disabled:cursor-not-allowed`}
        >
          AI Generate
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_MODE", mode: "check" })}
          disabled={isActive}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            state.mode === "check"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-300"
          } disabled:cursor-not-allowed`}
        >
          Check Domains
        </button>
      </div>

      {/* Provider badge */}
      {state.mode === "generate" && provider !== "server" && (
        <div className="mb-4">
          <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
            Using {PROVIDER_LABELS[provider]}
          </span>
        </div>
      )}

      {/* Form */}
      <div className="mb-8">
        {state.mode === "generate" ? (
          <SearchForm
            onSubmit={handleGenerate}
            disabled={isActive}
            defaultNameCount={settings?.defaultNameCount ?? 15}
          />
        ) : (
          <ManualCheck
            onEvent={handleEvent}
            onStart={handleManualStart}
            disabled={isActive}
          />
        )}
      </div>

      {/* Cancel button */}
      {isActive && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Results */}
      <ResultsPanel
        candidates={state.candidates}
        results={state.results}
        phase={state.phase}
        round={state.round}
        maxRounds={state.maxRounds}
      />
    </div>
  );
}
