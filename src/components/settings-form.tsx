"use client";

import { useState, useEffect } from "react";
import {
  loadSettings,
  saveSettings,
  type AiProvider,
  type Settings,
} from "@/lib/settings";

const PROVIDERS: { value: AiProvider; label: string; description: string }[] = [
  {
    value: "server",
    label: "Server",
    description: "Use the server's API key (default)",
  },
  {
    value: "anthropic",
    label: "Anthropic",
    description: "Use your own Anthropic API key",
  },
  {
    value: "openai",
    label: "OpenAI",
    description: "Use your own OpenAI API key",
  },
  {
    value: "ollama",
    label: "Ollama",
    description: "Use a local Ollama instance",
  },
];

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  if (!settings) return null;

  function update(patch: Partial<Settings>) {
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
  }

  function handleSave() {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Provider */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-zinc-300">
          AI Provider
        </legend>
        <div className="space-y-2">
          {PROVIDERS.map((p) => (
            <label
              key={p.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                settings.defaultProvider === p.value
                  ? "border-indigo-500/50 bg-indigo-500/5"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <input
                type="radio"
                name="provider"
                value={p.value}
                checked={settings.defaultProvider === p.value}
                onChange={() => update({ defaultProvider: p.value })}
                className="accent-indigo-500"
              />
              <div>
                <div className="text-sm font-medium text-zinc-200">
                  {p.label}
                </div>
                <div className="text-xs text-zinc-500">{p.description}</div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Anthropic settings */}
      {settings.defaultProvider === "anthropic" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="anthropic-key"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                id="anthropic-key"
                type={showAnthropicKey ? "text" : "password"}
                value={settings.anthropicApiKey}
                onChange={(e) => update({ anthropicApiKey: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 pr-16 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
              >
                {showAnthropicKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              Stored locally in your browser. Never sent to our server.
            </p>
          </div>
          <div>
            <label
              htmlFor="anthropic-model"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Model
            </label>
            <input
              id="anthropic-model"
              type="text"
              value={settings.anthropicModel}
              onChange={(e) => update({ anthropicModel: e.target.value })}
              placeholder="claude-sonnet-4-6"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      {/* OpenAI settings */}
      {settings.defaultProvider === "openai" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="openai-key"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                id="openai-key"
                type={showOpenaiKey ? "text" : "password"}
                value={settings.openaiApiKey}
                onChange={(e) => update({ openaiApiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 pr-16 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300"
              >
                {showOpenaiKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              Stored locally in your browser. Never sent to our server.
            </p>
          </div>
          <div>
            <label
              htmlFor="openai-model"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Model
            </label>
            <input
              id="openai-model"
              type="text"
              value={settings.openaiModel}
              onChange={(e) => update({ openaiModel: e.target.value })}
              placeholder="gpt-4o-mini"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      {/* Ollama settings */}
      {settings.defaultProvider === "ollama" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="ollama-url"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Ollama Base URL
            </label>
            <input
              id="ollama-url"
              type="text"
              value={settings.ollamaBaseUrl}
              onChange={(e) => update({ ollamaBaseUrl: e.target.value })}
              placeholder="http://localhost:11434"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label
              htmlFor="ollama-model"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Model
            </label>
            <input
              id="ollama-model"
              type="text"
              value={settings.ollamaModel}
              onChange={(e) => update({ ollamaModel: e.target.value })}
              placeholder="llama3.2"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      {/* Defaults */}
      <div className="flex flex-wrap gap-6">
        <div>
          <label
            htmlFor="name-count"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Default names per search
          </label>
          <input
            id="name-count"
            type="number"
            min={1}
            max={50}
            value={settings.defaultNameCount}
            onChange={(e) =>
              update({
                defaultNameCount: Math.min(
                  Math.max(parseInt(e.target.value) || 1, 1),
                  50
                ),
              })
            }
            className="w-32 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
        <div>
          <label
            htmlFor="max-rounds"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Max rounds per search
          </label>
          <input
            id="max-rounds"
            type="number"
            min={1}
            max={20}
            value={settings.maxRounds}
            onChange={(e) =>
              update({
                maxRounds: Math.min(
                  Math.max(parseInt(e.target.value) || 1, 1),
                  20
                ),
              })
            }
            className="w-32 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Used when &ldquo;find at least N&rdquo; is set
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Save Settings
        </button>
        {saved && (
          <span className="text-sm text-emerald-400">Settings saved</span>
        )}
      </div>
    </div>
  );
}
