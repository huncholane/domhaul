import { NextRequest } from "next/server";
import { generateNames } from "@/lib/anthropic";
import type { GenerateRequest, StreamEvent } from "@/lib/types";
import { DEFAULT_NAME_COUNT } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 60;

function encode(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { description, count } = body;
  if (!description?.trim()) {
    return new Response("Description is required", { status: 400 });
  }

  const nameCount = Math.min(Math.max(count ?? DEFAULT_NAME_COUNT, 1), 50);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encode({ type: "phase", phase: "generating" }));

        let emitted = 0;
        for await (const name of generateNames(description, nameCount)) {
          controller.enqueue(encode({ type: "candidate", name }));
          emitted++;
        }

        if (emitted === 0) {
          controller.enqueue(
            encode({ type: "error", message: "No valid names generated" })
          );
        }

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
