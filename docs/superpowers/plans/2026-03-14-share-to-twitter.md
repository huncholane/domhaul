# Share to X/Twitter Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users share their domain search results to X/Twitter with a rich preview card (OG image showing the prompt + available domains).

**Architecture:** When results finish, a "Share to X" button appears. Clicking it POSTs the prompt + available results to `/api/share` which stores them in Turso and returns a short ID. The browser then opens Twitter's intent URL with pre-filled text linking to `/share/[id]`. That share page is server-rendered with dynamic OG meta tags pointing to `/api/og?id=[id]` which generates the preview image on-the-fly using `@vercel/og`.

**Tech Stack:** Next.js (App Router), Turso/libsql (existing), `@vercel/og` (new dependency), Twitter Web Intent API

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/lib/cache.ts` | Add `shared_results` table init + `saveShare`/`getShare` functions |
| Create | `src/app/api/share/route.ts` | POST handler: store results, return share ID |
| Create | `src/app/api/og/route.tsx` | GET handler: generate dynamic OG image from share data |
| Create | `src/app/share/[id]/page.tsx` | Server-rendered share page with OG meta + results display |
| Modify | `src/components/results-panel.tsx` | Add "Share to X" button when phase is done |

---

## Chunk 1: Database + API

### Task 1: Add shared_results table and data access functions to cache.ts

**Files:**
- Modify: `src/lib/cache.ts`

- [ ] **Step 1: Add shared_results table creation to `ensureTable`**

In `src/lib/cache.ts`, update the `ensureTable` function to also create the `shared_results` table:

```typescript
async function ensureTable(db: Client) {
  if (initialized) return;
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS domain_cache (
        domain TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        checked_at INTEGER NOT NULL
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS shared_results (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        results TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      args: [],
    },
  ]);
  initialized = true;
}
```

- [ ] **Step 2: Add `saveShare` function**

Add to `src/lib/cache.ts`:

```typescript
export async function saveShare(
  id: string,
  prompt: string,
  results: { domain: string; brandScore?: number }[]
): Promise<boolean> {
  const db = getClient();
  if (!db) return false;
  try {
    await ensureTable(db);
    await db.execute({
      sql: `INSERT INTO shared_results (id, prompt, results, created_at) VALUES (?, ?, ?, ?)`,
      args: [id, prompt, JSON.stringify(results), Date.now()],
    });
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Add `getShare` function**

Add to `src/lib/cache.ts`:

```typescript
export interface SharedResult {
  id: string;
  prompt: string;
  results: { domain: string; brandScore?: number }[];
  createdAt: number;
}

export async function getShare(id: string): Promise<SharedResult | null> {
  const db = getClient();
  if (!db) return null;
  try {
    await ensureTable(db);
    const res = await db.execute({
      sql: "SELECT id, prompt, results, created_at FROM shared_results WHERE id = ?",
      args: [id],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id as string,
      prompt: row.prompt as string,
      results: JSON.parse(row.results as string),
      createdAt: row.created_at as number,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/cache.ts
git commit -m "feat: add shared_results table and data access functions"
```

### Task 2: Create POST /api/share endpoint

**Files:**
- Create: `src/app/api/share/route.ts`

- [ ] **Step 1: Create the share API route**

```typescript
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

    // Only store available domains with their brand scores
    const filtered = results
      .filter((r: { available?: boolean }) => r.available === true)
      .map((r: { domain: string; brandScore?: number }) => ({
        domain: r.domain,
        brandScore: r.brandScore,
      }));

    if (filtered.length === 0) {
      return NextResponse.json({ error: "No available domains to share" }, { status: 400 });
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
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/api/share/route.ts
git commit -m "feat: add POST /api/share endpoint"
```

---

## Chunk 2: OG Image + Share Page

### Task 3: Install @vercel/og and create OG image route

**Files:**
- Create: `src/app/api/og/route.tsx`

- [ ] **Step 1: Install @vercel/og**

Run: `npm install @vercel/og`

- [ ] **Step 2: Create the OG image API route**

```tsx
import { ImageResponse } from "@vercel/og";
import { getShare } from "@/lib/cache";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#a1a1aa",
          fontSize: 32,
        }}
      >
        domhaul
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const share = await getShare(id);

  if (!share) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#a1a1aa",
          fontSize: 32,
        }}
      >
        Share not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const domains = share.results.slice(0, 8); // Show max 8 in OG image

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        padding: "60px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: "#e4e4e7" }}>domhaul</span>
      </div>
      <div style={{ fontSize: 16, color: "#71717a", marginBottom: "32px" }}>
        AI-powered domain name generator
      </div>

      {/* Prompt */}
      <div style={{ fontSize: 20, color: "#a1a1aa", marginBottom: "6px" }}>Prompt:</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#e4e4e7",
          marginBottom: "32px",
          lineClamp: 2,
          overflow: "hidden",
        }}
      >
        &ldquo;{share.prompt}&rdquo;
      </div>

      {/* Available domains */}
      <div style={{ fontSize: 18, color: "#34d399", marginBottom: "16px", fontWeight: 600 }}>
        {share.results.length} available domain{share.results.length !== 1 ? "s" : ""} found
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {domains.map((d) => (
          <div
            key={d.domain}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: 20, color: "#e4e4e7", fontFamily: "monospace" }}>
              {d.domain}
            </span>
            {d.brandScore != null && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: d.brandScore >= 75 ? "#34d399" : d.brandScore >= 50 ? "#fbbf24" : "#71717a",
                }}
              >
                {d.brandScore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/route.tsx package.json package-lock.json
git commit -m "feat: add dynamic OG image generation for share pages"
```

### Task 4: Create the /share/[id] page

**Files:**
- Create: `src/app/share/[id]/page.tsx`

- [ ] **Step 1: Create the share page with dynamic OG meta tags**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getShare } from "@/lib/cache";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) return {};

  const count = share.results.length;
  const title = `Found ${count} available domain${count !== 1 ? "s" : ""} — domhaul`;
  const description = `AI-generated domains for "${share.prompt}" — ${count} available. Try domhaul to find yours.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/api/og?id=${id}`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?id=${id}`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) notFound();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={36} height={36} className="rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">domhaul</h1>
        </Link>
      </header>

      <div className="mb-6">
        <p className="text-sm text-zinc-500">Prompt</p>
        <p className="mt-1 text-lg font-medium text-zinc-200">&ldquo;{share.prompt}&rdquo;</p>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-medium text-emerald-400">
          {share.results.length} available domain{share.results.length !== 1 ? "s" : ""}
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {share.results.map((r) => (
          <div
            key={r.domain}
            className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-zinc-100">{r.domain}</span>
              {r.brandScore != null && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                    r.brandScore >= 75
                      ? "bg-emerald-500/15 text-emerald-400"
                      : r.brandScore >= 50
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-zinc-700/50 text-zinc-500"
                  }`}
                >
                  {r.brandScore}
                </span>
              )}
            </div>
            <a
              href={`/api/register?domain=${encodeURIComponent(r.domain)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Register
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Try domhaul — Find your perfect domain
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, `/share/[id]` appears as dynamic route

- [ ] **Step 3: Commit**

```bash
git add src/app/share/
git commit -m "feat: add /share/[id] page with dynamic OG meta"
```

---

## Chunk 3: Frontend Share Button

### Task 5: Add "Share to X" button to results panel

**Files:**
- Modify: `src/components/results-panel.tsx`

- [ ] **Step 1: Add share handler and button**

Update `ResultsPanel` to accept `prompt` prop and add the share button. The component needs:

1. New prop: `prompt: string`
2. A `sharing` state for loading indicator
3. A `handleShare` function that POSTs to `/api/share` and opens Twitter intent
4. An X/Twitter button next to the "Available only" filter when `phase === "done"`

The share button should:
- Only appear when `phase === "done"` and there are available domains
- POST `{ prompt, results }` to `/api/share`
- On success, open `https://twitter.com/intent/tweet?text=...&url=...` in a new tab
- Tweet text: `"Just found ${count} available domains for my project with @domhaul 🔥\n\nAI-powered domain name generator 👉"`
- Tweet URL: `https://www.domhaul.com/share/${id}`

Add after the "Available only" button:

```tsx
{phase === "done" && availableCount > 0 && (
  <button
    type="button"
    onClick={handleShare}
    disabled={sharing}
    className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-300 disabled:opacity-50"
  >
    {sharing ? "Sharing..." : "Share to X"}
  </button>
)}
```

- [ ] **Step 2: Update page.tsx to pass prompt to ResultsPanel**

In `src/app/page.tsx`, track the current prompt in state and pass it to `ResultsPanel`:

1. Add `prompt` state: `const [prompt, setPrompt] = useState("")`
2. In `handleGenerate`, set prompt: `setPrompt(params.description)`
3. Pass to ResultsPanel: `<ResultsPanel ... prompt={prompt} />`

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Test end-to-end locally**

Run: `npm run dev`
1. Generate some domain names
2. Click "Share to X"
3. Verify Twitter compose opens with pre-filled message
4. Visit the share URL — verify OG image loads and page renders

- [ ] **Step 5: Commit**

```bash
git add src/components/results-panel.tsx src/app/page.tsx
git commit -m "feat: add Share to X button with Twitter intent"
```
