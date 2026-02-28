import { NextRequest } from "next/server";
import { checkDomains } from "@/lib/domain-checker";
import type { CheckRequest, StreamEvent } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function encode(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/;

function parseDomains(input: string[]): string[] {
  const domains: string[] = [];
  for (const item of input) {
    // Support comma-separated, newline-separated, or space-separated
    const parts = item
      .split(/[,\s\n]+/)
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    for (const part of parts) {
      if (DOMAIN_REGEX.test(part) && !domains.includes(part)) {
        domains.push(part);
      }
    }
  }
  return domains;
}

export async function POST(req: NextRequest) {
  let body: CheckRequest;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const domains = parseDomains(body.domains ?? []);
  if (domains.length === 0) {
    return new Response("No valid domains provided", { status: 400 });
  }

  if (domains.length > 100) {
    return new Response("Maximum 100 domains per request", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encode({ type: "phase", phase: "checking" }));

        await checkDomains(domains, (result) => {
          controller.enqueue(encode({ type: "result", result }));
        });

        controller.enqueue(encode({ type: "done" }));
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        try {
          controller.enqueue(encode({ type: "error", message }));
          controller.enqueue(encode({ type: "done" }));
          controller.close();
        } catch {
          // Stream may already be closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
