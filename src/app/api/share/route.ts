import { NextRequest, NextResponse } from "next/server";
import { saveShare } from "@/lib/cache";

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, results } = body;

    if (!prompt || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const filtered = results
      .filter((r: { available?: boolean }) => r.available === true)
      .map((r: { domain: string; brandScore?: number }) => ({
        domain: r.domain,
        brandScore: r.brandScore,
      }));

    if (filtered.length === 0) {
      return NextResponse.json(
        { error: "No available domains to share" },
        { status: 400 }
      );
    }

    const id = generateId();
    const saved = await saveShare(id, prompt, filtered);

    if (!saved) {
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ id, url: `/share/${id}` });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
