import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your .env.local file."
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}

const NAME_REGEX = /^[a-z0-9]{2,20}$/;

export async function* generateNames(
  description: string,
  count: number
): AsyncGenerator<string> {
  const anthropic = getClient();

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(description, count) }],
  });

  let buffer = "";
  const seen = new Set<string>();

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      buffer += event.delta.text;

      // Process complete lines
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

  // Process any remaining buffer
  if (buffer.trim()) {
    const name = buffer.trim().toLowerCase();
    if (NAME_REGEX.test(name) && !seen.has(name)) {
      yield name;
    }
  }
}
