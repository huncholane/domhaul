import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

const NAME_REGEX = /^[a-z0-9]{2,20}$/;

export async function* generateNamesAnthropic(
  apiKey: string,
  model: string,
  description: string,
  count: number,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const stream = client.messages.stream(
    {
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: buildUserPrompt(description, count) },
      ],
    },
    { signal }
  );

  let buffer = "";
  const seen = new Set<string>();

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      buffer += event.delta.text;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const name = line.trim().toLowerCase();
        if (NAME_REGEX.test(name) && !seen.has(name)) {
          seen.add(name);
          yield name;
        }
      }
    }
  }

  if (buffer.trim()) {
    const name = buffer.trim().toLowerCase();
    if (NAME_REGEX.test(name) && !seen.has(name)) {
      yield name;
    }
  }
}

export async function* generateNamesOpenAI(
  apiKey: string,
  model: string,
  description: string,
  count: number,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(description, count) },
      ],
      max_tokens: 1024,
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${text}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response stream from OpenAI");

  const decoder = new TextDecoder();
  let sseBuffer = "";
  let nameBuffer = "";
  const seen = new Set<string>();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      sseBuffer += decoder.decode(value, { stream: true });
      const lines = sseBuffer.split("\n");
      sseBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
        try {
          const json = JSON.parse(line.slice(6));
          const content = json.choices?.[0]?.delta?.content;
          if (!content) continue;

          nameBuffer += content;
          const nameLines = nameBuffer.split("\n");
          nameBuffer = nameLines.pop() ?? "";

          for (const nl of nameLines) {
            const name = nl.trim().toLowerCase();
            if (NAME_REGEX.test(name) && !seen.has(name)) {
              seen.add(name);
              yield name;
            }
          }
        } catch {
          // skip malformed SSE
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (nameBuffer.trim()) {
    const name = nameBuffer.trim().toLowerCase();
    if (NAME_REGEX.test(name) && !seen.has(name)) {
      yield name;
    }
  }
}

export async function* generateNamesOllama(
  baseUrl: string,
  model: string,
  description: string,
  count: number,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(description, count) },
      ],
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error: ${res.status} ${text}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response stream from Ollama");

  const decoder = new TextDecoder();
  let ndjsonBuffer = "";
  let nameBuffer = "";
  const seen = new Set<string>();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      ndjsonBuffer += decoder.decode(value, { stream: true });
      const lines = ndjsonBuffer.split("\n");
      ndjsonBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const content = json.message?.content;
          if (!content) continue;

          nameBuffer += content;
          const nameLines = nameBuffer.split("\n");
          nameBuffer = nameLines.pop() ?? "";

          for (const nl of nameLines) {
            const name = nl.trim().toLowerCase();
            if (NAME_REGEX.test(name) && !seen.has(name)) {
              seen.add(name);
              yield name;
            }
          }
        } catch {
          // skip malformed NDJSON
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (nameBuffer.trim()) {
    const name = nameBuffer.trim().toLowerCase();
    if (NAME_REGEX.test(name) && !seen.has(name)) {
      yield name;
    }
  }
}
